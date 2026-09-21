"use server";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { BUCKETS } from "@/server/storage";
import { audit } from "@/server/audit/audit";
import { generateRegistrationBundle, generateCustomerDoc } from "@/server/fulfillment/bundle";

export type R = { ok: true; message?: string } | { ok: false; error: string };
const fail = (e: unknown): R => ({ ok: false, error: (e as Error).message ?? "오류가 발생했습니다" });
const HQ = ["SUPER_ADMIN", "HQ_STAFF"] as const;

/* ───────── 차량 재고 ───────── */
/** 여러 줄 입력: 차대번호, 차종(2VAN/5VAN), 색상, 연식, 제작연월일(YYYY-MM-DD), 입항일 — 쉼표·탭 구분 */
export async function addVehiclesAction(formData: FormData): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    const text = String(formData.get("lines") ?? "");
    const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean).map((l) => l.split(/[,\t]/).map((x) => x.trim()));
    if (rows.length === 0) throw new Error("입력된 줄이 없습니다");
    const recs = rows.map((r, i) => {
      const vin = (r[0] ?? "").toUpperCase().replace(/\s/g, "");
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) throw new Error(`${i + 1}번째 줄 차대번호 형식 오류: ${r[0]}`);
      const model = (r[1] ?? "").toUpperCase().replace(/\s/g, "");
      const model_code = model.startsWith("5") ? "5VAN" : "2VAN";
      const edition = /BE|BLACK/.test(model) || /블랙\s*에디션|black edition/i.test(r[2] ?? "") ? "Black Edition" : null;
      return { vin, model_code, edition, color: r[2] || null, model_year: r[3] ? Number(r[3]) : 2026, mfg_date: r[4] || null, import_date: r[5] || null, status: "STOCK" };
    });
    const { error } = await supabaseAdmin().from("vehicles").insert(recs);
    if (error) throw new Error(error.message.includes("duplicate") ? "이미 등록된 차대번호가 있습니다" : error.message);
    await audit(user, "vehicle.add", "vehicle", recs.map((r) => r.vin).join(","), { count: recs.length });
    revalidatePath("/admin/stock");
    return { ok: true, message: `${recs.length}대 등록` };
  } catch (e) { return fail(e); }
}

export async function deleteVehicleAction(id: string): Promise<R> {
  const user = await requireUser("SUPER_ADMIN");
  try {
    const { data: v } = await supabaseAdmin().from("vehicles").select("status, vin").eq("id", id).maybeSingle();
    if (!v) throw new Error("없는 차량입니다");
    if (v.status !== "STOCK") throw new Error("배정·출고된 차량은 삭제할 수 없습니다");
    await supabaseAdmin().from("vehicles").delete().eq("id", id);
    await audit(user, "vehicle.delete", "vehicle", id, { vin: v.vin });
    revalidatePath("/admin/stock");
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function assignVinAction(contractId: string, vehicleId: string): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    const admin = supabaseAdmin();
    const { data: v } = await admin.from("vehicles").select("*").eq("id", vehicleId).maybeSingle();
    if (!v) throw new Error("차량을 찾을 수 없습니다");
    if (v.status !== "STOCK") throw new Error("이미 배정된 차량입니다");
    // 기존 배정 해제
    await admin.from("vehicles").update({ status: "STOCK", contract_id: null }).eq("contract_id", contractId).eq("status", "ASSIGNED");
    const { error } = await admin.from("vehicles").update({ status: "ASSIGNED", contract_id: contractId }).eq("id", vehicleId);
    if (error) throw new Error(error.message);
    await admin.from("contract_vehicle").update({ vin: v.vin }).eq("contract_id", contractId);
    await admin.from("contracts").update({ vehicle_status: "VIN_ASSIGNED" }).eq("id", contractId); // 상태값이 없으면 무시됨
    await audit(user, "contract.assign_vin", "contract", contractId, { vin: v.vin });
    revalidatePath(`/contracts/${contractId}`); revalidatePath("/admin/stock");
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function unassignVinAction(contractId: string): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    const admin = supabaseAdmin();
    await admin.from("vehicles").update({ status: "STOCK", contract_id: null }).eq("contract_id", contractId).eq("status", "ASSIGNED");
    await admin.from("contract_vehicle").update({ vin: null }).eq("contract_id", contractId);
    await audit(user, "contract.unassign_vin", "contract", contractId, null);
    revalidatePath(`/contracts/${contractId}`); revalidatePath("/admin/stock");
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function markDeliveredAction(contractId: string): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    await supabaseAdmin().from("vehicles").update({ status: "DELIVERED" }).eq("contract_id", contractId);
    await audit(user, "contract.delivered", "contract", contractId, null);
    revalidatePath(`/contracts/${contractId}`); revalidatePath("/admin/stock");
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ───────── 입금 ───────── */
export async function addPaymentAction(contractId: string, formData: FormData): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    const amount = Number(String(formData.get("amount") ?? "").replace(/[^\d]/g, ""));
    const kind = String(formData.get("kind") ?? "DEPOSIT");
    const paid_at = String(formData.get("paid_at") ?? "");
    if (!amount || !paid_at) throw new Error("금액과 입금일을 입력하세요");
    const { error } = await supabaseAdmin().from("payments").insert({ contract_id: contractId, kind, amount, paid_at, payer_name: String(formData.get("payer_name") ?? "") || null, memo: String(formData.get("memo") ?? "") || null, confirmed_by: user.id });
    if (error) throw new Error(error.message);
    await audit(user, "contract.payment_add", "contract", contractId, { kind, amount, paid_at });
    revalidatePath(`/contracts/${contractId}`);
    return { ok: true };
  } catch (e) { return fail(e); }
}
export async function deletePaymentAction(contractId: string, paymentId: string): Promise<R> {
  const user = await requireUser("SUPER_ADMIN");
  try {
    await supabaseAdmin().from("payments").delete().eq("id", paymentId).eq("contract_id", contractId);
    await audit(user, "contract.payment_delete", "contract", contractId, { paymentId });
    revalidatePath(`/contracts/${contractId}`);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ───────── 위임받은 자 ───────── */
export async function saveAgentAction(formData: FormData): Promise<R> {
  const user = await requireUser("SUPER_ADMIN");
  try {
    const rows = [["REG_AGENT_NAME", "name"], ["REG_AGENT_RRN", "rrn"], ["REG_AGENT_ADDRESS", "address"]].map(([k, f]) => ({ key: k!, value: String(formData.get(f!) ?? "").trim() }));
    const { error } = await supabaseAdmin().from("app_settings").upsert(rows, { onConflict: "key" });
    if (error) throw new Error(error.message);
    await audit(user, "settings.reg_agent", "app_settings", "REG_AGENT", null);
    revalidatePath("/admin/registration");
    return { ok: true, message: "저장했습니다" };
  } catch (e) { return fail(e); }
}

/* ───────── 파일 업로드 (브라우저 → Supabase Storage 직접 전송, Vercel 4.5MB 제한 회피) ───────── */
export type UploadTarget =
  | { type: "MODEL"; modelCode: "2VAN" | "5VAN"; docType: string }
  | { type: "COMPANY"; docType: string }
  | { type: "CUSTOMS"; vehicleId: string }
  | { type: "ATTACHMENT"; contractId: string; docType: string; label?: string };

const safeName = (n: string) => n.replace(/[^\w.\-가-힣]/g, "_").slice(0, 80);

export async function prepareUploadAction(target: UploadTarget, filename: string): Promise<{ ok: true; signedUrl: string; path: string } | { ok: false; error: string }> {
  await requireUser(...HQ);
  try {
    const stamp = Date.now().toString(36);
    let p: string;
    if (target.type === "MODEL") p = `_registration/model/${target.modelCode}/${target.docType}-${stamp}-${safeName(filename)}`;
    else if (target.type === "COMPANY") p = `_registration/company/${target.docType}-${stamp}-${safeName(filename)}`;
    else if (target.type === "CUSTOMS") p = `_registration/customs/${target.vehicleId}-${stamp}-${safeName(filename)}`;
    else {
      const { data: c } = await supabaseAdmin().from("contracts").select("contract_no").eq("id", target.contractId).maybeSingle();
      if (!c) throw new Error("계약을 찾을 수 없습니다");
      p = `${c.contract_no}/attachments/${target.docType}-${stamp}-${safeName(filename)}`;
    }
    const { data, error } = await supabaseAdmin().storage.from(BUCKETS.docs).createSignedUploadUrl(p);
    if (error || !data) throw new Error(error?.message ?? "업로드 URL 생성 실패");
    return { ok: true, signedUrl: data.signedUrl, path: data.path };
  } catch (e) { return { ok: false, error: (e as Error).message }; }
}

export async function registerUploadAction(target: UploadTarget, path: string, mime: string): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    const admin = supabaseAdmin();
    if (target.type === "MODEL" || target.type === "COMPANY") {
      const row = target.type === "MODEL" ? { scope: "MODEL", model_code: target.modelCode, doc_type: target.docType } : { scope: "COMPANY", model_code: null, doc_type: target.docType };
      // 같은 종류는 교체
      let q = admin.from("model_docs").delete().eq("scope", row.scope).eq("doc_type", row.doc_type);
      q = row.model_code ? q.eq("model_code", row.model_code) : q.is("model_code", null);
      await q;
      const { error } = await admin.from("model_docs").insert({ ...row, file_path: path, mime });
      if (error) throw new Error(error.message);
      revalidatePath("/admin/registration");
    } else if (target.type === "CUSTOMS") {
      const { error } = await admin.from("vehicles").update({ customs_doc_path: path }).eq("id", target.vehicleId);
      if (error) throw new Error(error.message);
      revalidatePath("/admin/stock");
    } else {
      const { error } = await admin.from("contract_attachments").insert({ contract_id: target.contractId, doc_type: target.docType, label: target.label ?? null, file_path: path, mime });
      if (error) throw new Error(error.message);
      revalidatePath(`/contracts/${target.contractId}`);
    }
    await audit(user, "registration.upload", "storage", path, null);
    return { ok: true };
  } catch (e) { return fail(e); }
}

export async function deleteAttachmentAction(contractId: string, id: string): Promise<R> {
  const user = await requireUser(...HQ);
  try {
    await supabaseAdmin().from("contract_attachments").delete().eq("id", id).eq("contract_id", contractId);
    await audit(user, "registration.attachment_delete", "contract", contractId, { id });
    revalidatePath(`/contracts/${contractId}`);
    return { ok: true };
  } catch (e) { return fail(e); }
}

/* ───────── 서류 생성 ───────── */
export async function generateBundleAction(contractId: string): Promise<R & { filePath?: string }> {
  const user = await requireUser("SUPER_ADMIN");
  try {
    const r = await generateRegistrationBundle(contractId, user.id);
    await audit(user, "registration.bundle", "contract", contractId, { file: r.filePath, items: r.list });
    revalidatePath(`/contracts/${contractId}`);
    const missing = r.list.filter((x) => x.source === "누락(표지)").map((x) => x.title);
    return { ok: true, filePath: r.filePath, message: missing.length ? `생성 완료 — 누락 서류(표지로 대체): ${missing.join(", ")}` : "생성 완료 — 12종 모두 포함" };
  } catch (e) { return fail(e); }
}

export async function generateCustomerDocAction(contractId: string, kind: "PAYMENT" | "RELEASE", releaseDate?: string): Promise<R & { filePath?: string }> {
  const user = await requireUser(...HQ);
  try {
    const r = await generateCustomerDoc(contractId, user.id, kind, { releaseDate });
    await audit(user, kind === "PAYMENT" ? "registration.payment_doc" : "registration.release_doc", "contract", contractId, { file: r.filePath });
    revalidatePath(`/contracts/${contractId}`);
    return { ok: true, filePath: r.filePath };
  } catch (e) { return fail(e); }
}
