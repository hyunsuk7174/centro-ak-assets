import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument } from "pdf-lib";
import { loadContract, decryptBuyerPii } from "@/server/contracts/repo";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { storage, BUCKETS } from "@/server/storage";
import { htmlToPdfMany } from "@/server/pdf/render";
import { getAgent, getVehicleForContract, listAttachments, listModelDocs, listPayments, MODEL_INFO, type Vehicle } from "./repo";
import { delegationHtml, sealDeclarationHtml, lowEmissionHtml, paymentConfirmationHtml, releaseNoteHtml, separatorHtml, todayK, type Seals, type VehicleInfo, type BuyerInfo } from "./docsHtml";

async function loadAssets() {
  const root = process.cwd();
  const b64 = async (p: string) => (await readFile(path.join(root, p))).toString("base64");
  const font = await b64("public/fonts/NotoSansKR-Regular.otf");
  const seals: Seals = { corporate: await b64("assets/seals/corporate.png"), usage: await b64("assets/seals/usage.png"), nameplate: await b64("assets/seals/nameplate.png") };
  return { font, seals };
}

function vehicleInfo(v: Vehicle): VehicleInfo {
  return { modelCode: v.model_code, modelName: MODEL_INFO[v.model_code].name(v.model_year), vin: v.vin, color: v.color, modelYear: v.model_year, edition: v.edition };
}

async function loadBase(contractId: string) {
  const c = await loadContract(contractId);
  if (!c) throw new Error("계약을 찾을 수 없습니다");
  const b1 = c.buyers[0]!;
  const pii = decryptBuyerPii(b1);
  const buyer: BuyerInfo = { name: String(b1.snapshot_name), type: String(b1.snapshot_type), address: String(b1.snapshot_address ?? ""), mobile: pii.mobile };
  const vehicleLabel = [c.vehicle?.model_name, c.vehicle?.trim, c.vehicle?.edition].filter(Boolean).join(" ") + (c.vehicle?.color ? ` · ${c.vehicle.color}` : "");
  return { c, buyer, vehicleLabel };
}

/** 이미지/PDF 를 묶음 PDF 에 추가 */
async function appendFile(doc: PDFDocument, buf: Buffer, mime: string | null, filePath: string) {
  const isPdf = (mime ?? "").includes("pdf") || filePath.toLowerCase().endsWith(".pdf") || buf.subarray(0, 4).toString() === "%PDF";
  if (isPdf) {
    const src = await PDFDocument.load(new Uint8Array(buf), { ignoreEncryption: true });
    const pages = await doc.copyPages(src, src.getPageIndices());
    pages.forEach((p) => doc.addPage(p));
    return;
  }
  const isPng = (mime ?? "").includes("png") || filePath.toLowerCase().endsWith(".png") || (buf[0] === 0x89 && buf[1] === 0x50);
  const img = isPng ? await doc.embedPng(new Uint8Array(buf)) : await doc.embedJpg(new Uint8Array(buf));
  const page = doc.addPage([595.28, 841.89]);
  const m = 36, maxW = 595.28 - 2 * m, maxH = 841.89 - 2 * m;
  const s = Math.min(maxW / img.width, maxH / img.height, 1e9);
  const w = img.width * s, h = img.height * s;
  page.drawImage(img, { x: (595.28 - w) / 2, y: (841.89 - h) / 2, width: w, height: h });
}

async function fetchDoc(filePath: string) { return storage.get(BUCKETS.docs, filePath); }

/** 등록서류 묶음 PDF 생성 (12종 순서) */
export async function generateRegistrationBundle(contractId: string, userId: string) {
  const { c, buyer } = await loadBase(contractId);
  const v = await getVehicleForContract(contractId);
  if (!v) throw new Error("차대번호가 아직 배정되지 않았습니다. 먼저 차량을 배정하세요.");
  const agent = await getAgent();
  if (!agent.name) throw new Error("위임받은 자(등록대행 담당자) 정보가 없습니다. 등록서류 설정에서 입력하세요.");
  const { font, seals } = await loadAssets();
  const vi = vehicleInfo(v);
  const info = MODEL_INFO[v.model_code];
  const [docs, atts] = await Promise.all([listModelDocs(), listAttachments(contractId)]);
  const modelDoc = (t: string) => docs.find((d) => d.scope === "MODEL" && d.model_code === v.model_code && d.doc_type === t) ?? null;
  const companyDoc = (t: string) => docs.find((d) => d.scope === "COMPANY" && d.doc_type === t) ?? null;

  // 생성 서류 3종 + 필요 시 표지 (브라우저 1회)
  const gen: { key: string; html: string }[] = [
    { key: "DELEGATION", html: delegationHtml(font, seals, agent, vi) },
    { key: "SEAL_DECL", html: sealDeclarationHtml(font, seals) },
    { key: "LOW_EMISSION", html: lowEmissionHtml(font, seals, vi, info.emissionCertNo) },
  ];
  const sepIf = (cond: boolean, key: string, no: number, title: string, note: string) => { if (cond) gen.push({ key, html: separatorHtml(font, no, title, note) }); };
  sepIf(!companyDoc("CORP_SEAL_CERT"), "SEP_CORP_SEAL", 3, "법인인감증명서", "원본을 별도 첨부하세요");
  sepIf(!companyDoc("BIZ_CERT"), "SEP_BIZ", 4, "사업자등록증", "등록서류 설정에서 업로드되지 않았습니다");
  sepIf(!v.customs_doc_path, "SEP_CUSTOMS", 6, "수입통관필증", "차량 재고에서 이 차대번호의 통관필증을 업로드하세요");
  const taxInv = atts.filter((a) => a.doc_type === "TAX_INVOICE");
  sepIf(taxInv.length === 0, "SEP_TAX", 7, "세금계산서", "홈택스 발급본을 계약 첨부에 업로드하세요");
  gen.push({ key: "SEP_MFG", html: separatorHtml(font, 8, "자동차제작증", "자동차365 발급본을 별도 첨부하세요") });
  sepIf(!modelDoc("SPEC_NOTICE"), "SEP_SPEC", 9, "제원관리번호통보서", `${v.model_code} 서류가 업로드되지 않았습니다`);
  sepIf(!modelDoc("EMISSION_CERT"), "SEP_EMI", 10, "배출가스 인증서", `${v.model_code} 서류가 업로드되지 않았습니다`);
  sepIf(!modelDoc("NOISE_CERT"), "SEP_NOISE", 11, "소음 인증서", `${v.model_code} 서류가 업로드되지 않았습니다`);
  const ids = atts.filter((a) => a.doc_type === "ID_CARD" || a.doc_type === "BUYER_BIZ_CERT" || a.doc_type === "OTHER");
  sepIf(ids.length === 0, "SEP_ID", 12, "고객 신분증 / 사업자등록증", "계약 첨부에 업로드하세요");
  const pdfs = await htmlToPdfMany(gen.map((g) => g.html));
  const genPdf = (key: string) => { const i = gen.findIndex((g) => g.key === key); return i >= 0 ? pdfs[i]! : null; };

  // 순서대로 병합
  const out = await PDFDocument.create();
  const list: { no: number; title: string; source: "생성" | "업로드" | "누락(표지)" }[] = [];
  const add = async (no: number, title: string, genKey: string | null, upload: { file_path: string; mime: string | null }[] | null, sepKey: string | null) => {
    if (genKey && genPdf(genKey)) { await appendFile(out, genPdf(genKey)!, "application/pdf", "x.pdf"); list.push({ no, title, source: "생성" }); return; }
    if (upload && upload.length) { for (const u of upload) await appendFile(out, await fetchDoc(u.file_path), u.mime, u.file_path); list.push({ no, title, source: "업로드" }); return; }
    if (sepKey && genPdf(sepKey)) { await appendFile(out, genPdf(sepKey)!, "application/pdf", "x.pdf"); list.push({ no, title, source: "누락(표지)" }); }
  };
  await add(1, "위임장", "DELEGATION", null, null);
  await add(2, "사용인감계", "SEAL_DECL", null, null);
  await add(3, "법인인감증명서", null, companyDoc("CORP_SEAL_CERT") ? [companyDoc("CORP_SEAL_CERT")!] : null, "SEP_CORP_SEAL");
  await add(4, "사업자등록증", null, companyDoc("BIZ_CERT") ? [companyDoc("BIZ_CERT")!] : null, "SEP_BIZ");
  await add(5, "저공해자동차 증명서", "LOW_EMISSION", null, null);
  await add(6, "수입통관필증", null, v.customs_doc_path ? [{ file_path: v.customs_doc_path, mime: null }] : null, "SEP_CUSTOMS");
  await add(7, "세금계산서", null, taxInv, "SEP_TAX");
  await add(8, "자동차제작증", null, null, "SEP_MFG");
  await add(9, "제원관리번호통보서", null, modelDoc("SPEC_NOTICE") ? [modelDoc("SPEC_NOTICE")!] : null, "SEP_SPEC");
  await add(10, "배출가스 인증서", null, modelDoc("EMISSION_CERT") ? [modelDoc("EMISSION_CERT")!] : null, "SEP_EMI");
  await add(11, "소음 인증서", null, modelDoc("NOISE_CERT") ? [modelDoc("NOISE_CERT")!] : null, "SEP_NOISE");
  await add(12, "고객 신분증 / 사업자등록증", null, ids, "SEP_ID");

  const bytes = Buffer.from(await out.save());
  const t = todayK();
  const filePath = `${c.contract_no}/registration/REG-${t.y}${t.m}${t.d}-${Date.now().toString(36)}.pdf`;
  await storage.put(BUCKETS.docs, filePath, bytes, "application/pdf");
  await supabaseAdmin().from("registration_bundles").insert({ contract_id: contractId, file_path: filePath, doc_list: { kind: "BUNDLE", vin: v.vin, buyer: buyer.name, items: list }, generated_by: userId });
  return { filePath, list };
}

/** 입금확인서 / 출고증 단건 생성 */
export async function generateCustomerDoc(contractId: string, userId: string, kind: "PAYMENT" | "RELEASE", opts?: { releaseDate?: string }) {
  const { c, buyer, vehicleLabel } = await loadBase(contractId);
  const { font, seals } = await loadAssets();
  const v = await getVehicleForContract(contractId);
  let html: string; let prefix: string;
  if (kind === "PAYMENT") {
    const rows = await listPayments(contractId);
    if (rows.length === 0) throw new Error("기록된 입금이 없습니다");
    html = paymentConfirmationHtml(font, seals, c.contract_no, buyer, v ? vehicleInfo(v) : null, rows.map((r) => ({ kind: r.kind, amount: Number(r.amount), paidAt: r.paid_at, payerName: r.payer_name, memo: r.memo })), Number((c.pricing as Record<string, unknown> | null)?.sale_price ?? 0), vehicleLabel);
    prefix = "PAYMENT";
  } else {
    if (!v) throw new Error("차대번호가 아직 배정되지 않았습니다");
    const t = todayK();
    html = releaseNoteHtml(font, seals, c.contract_no, buyer, vehicleInfo(v), vehicleLabel, String((c.delivery as Record<string, unknown> | null)?.delivery_place || buyer.address || ""), opts?.releaseDate || `${t.y}-${t.m}-${t.d}`, c.sales?.name ?? "", c.sales?.phone ?? "");
    prefix = "RELEASE";
  }
  const [pdf] = await htmlToPdfMany([html]);
  const filePath = `${c.contract_no}/registration/${prefix}-${Date.now().toString(36)}.pdf`;
  await storage.put(BUCKETS.docs, filePath, pdf!, "application/pdf");
  await supabaseAdmin().from("registration_bundles").insert({ contract_id: contractId, file_path: filePath, doc_list: { kind, vin: v?.vin ?? null, buyer: buyer.name }, generated_by: userId });
  return { filePath };
}
