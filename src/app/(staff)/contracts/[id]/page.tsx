export const maxDuration = 60; // PDF 생성(Chromium) 시간 확보
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser, isSuper, isHq } from "@/lib/auth";
import { supabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { loadContract } from "@/server/contracts/repo";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriceSummary } from "@/components/contract/PriceSummary";
import { maskMobile, maskRrn, formatWon } from "@/lib/mask";
import { CancelButton } from "./CancelButton";
import { RetryPdfButton } from "./RetryPdfButton";
import { CustomerSendPanel } from "./CustomerSendPanel";
import { FulfillmentPanel } from "./FulfillmentPanel";
import { getVehicleForContract, listVehicles, listPayments, listAttachments, listBundles, getAgent } from "@/server/fulfillment/repo";

export default async function ContractDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const { id } = await params;
  const sb = await supabaseServer();
  const { data: gate } = await sb.from("contracts").select("id").eq("id", id).maybeSingle();
  if (!gate) notFound();
  const c = await loadContract(id);
  if (!c) notFound();
  const admin = supabaseAdmin();
  const [{ data: events }, { data: consents }, { data: sigs }, { data: idv }, { data: docs }, { data: da }] = await Promise.all([
    admin.from("contract_events").select("event, from_status, to_status, actor, created_at, meta").eq("contract_id", id).order("created_at", { ascending: false }),
    admin.from("consent_records").select("buyer_seq, consent_key, value, channels, consented_at").eq("contract_id", id).order("buyer_seq"),
    admin.from("signatures").select("signer_role, signed_at, invalidated_at, payload_hash, identity_verification_id").eq("contract_id", id),
    admin.from("identity_verifications").select("provider, transaction_id, verified_name, verified_mobile_last4, success, verified_at").eq("contract_id", id),
    admin.from("generated_documents").select("doc_type, sha256, generated_at").eq("contract_id", id),
    admin.from("discount_approvals").select("amount, status, decided_at").eq("contract_id", id),
  ]);
  const hq = isHq(user);
  const [fVehicle, fStock, fPayments, fAtts, fBundles, fAgent] = hq
    ? await Promise.all([getVehicleForContract(id), listVehicles("STOCK"), listPayments(id), listAttachments(id), listBundles(id), getAgent()])
    : [null, [], [], [], [], { name: "" }];
  const modelCode = c.vehicle?.model_name ? (String(c.vehicle.model_name).includes("5") ? "5VAN" as const : "2VAN" as const) : null;
  const editable = ["DRAFT", "CUSTOMER_REVIEW", "IDENTITY_VERIFIED", "SIGNED"].includes(c.status);
  const v = c.vehicle, p = c.pricing, d = c.delivery;
  const b1Email = (c.buyers[0]?.snapshot_email as string | null) || null;
  const emailMasked = b1Email ? b1Email.replace(/^(.).*(@.*)$/, "$1***$2") : null;
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div><p className="text-sm text-muted"><Link href="/dashboard" className="hover:text-ink">계약</Link></p><h1 className="flex flex-wrap items-center gap-3">{c.contract_no} <StatusBadge status={c.status} /></h1></div>
        <div className="flex flex-wrap gap-2">
          {editable && <Link href={`/contracts/${id}/edit/review`} className="btn-secondary">수정 / 발송</Link>}
          {docs && docs.length > 0 && <a href={`/contracts/${id}/document?type=COMPANY`} className="btn-primary">계약서 PDF</a>}
          {c.status === "SIGNED" && <RetryPdfButton contractId={id} />}
          {isSuper(user) && !["CANCELLED", "REFUNDED"].includes(c.status) && <CancelButton contractId={id} />}
        </div>
      </div>
      <div className="mt-6"><CustomerSendPanel contractId={id} status={c.status} hasDocs={!!docs && docs.length > 0} buyerEmailMasked={emailMasked} /></div>
      {hq && c.status === "COMPLETED" && <div className="mt-6"><FulfillmentPanel contractId={id} contractNo={c.contract_no} isSuper={isSuper(user)} modelCode={modelCode} salePrice={Number(p?.sale_price ?? 0)} deposit={Number(p?.deposit ?? 0)} isInstallment={(p as Record<string, unknown> | null)?.payment_type === "INSTALLMENT"} vehicle={fVehicle} stock={fStock} payments={fPayments} attachments={fAtts} bundles={fBundles} agentReady={!!fAgent.name} /></div>}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <section><h2>차량</h2><dl className="mt-2"><div className="row"><dt>차종</dt><dd className="whitespace-normal">{v ? `${v.model_name} ${v.trim} ${v.edition ?? ""}` : "—"}</dd></div><div className="row"><dt>색상 / 수량</dt><dd>{v?.color as string} / {String(v?.quantity ?? "")}대</dd></div><div className="row"><dt>옵션</dt><dd>{(v?.options_text as string) || "—"}</dd></div><div className="row"><dt>VIN</dt><dd>{(v?.vin as string) || "미배정"}</dd></div><div className="row"><dt>출고상태</dt><dd>{c.vehicle_status}</dd></div></dl></section>
          <section><h2>매수인</h2>
            {c.buyers.map((b) => <dl key={String(b.seq)} className="mt-2 rounded-md bg-paper p-3"><div className="row"><dt>매수인 {String(b.seq)}</dt><dd className="font-medium">{String(b.snapshot_name)}{b.snapshot_ceo_name ? ` / ${b.snapshot_ceo_name}` : ""}</dd></div><div className="row"><dt>{b.snapshot_type === "CORPORATE" ? "사업자번호" : "주민등록번호"}</dt><dd>{b.snapshot_type === "CORPORATE" ? String(b.snapshot_biz_no) : maskRrn(b.snapshot_rrn_prefix as string)}</dd></div><div className="row"><dt>휴대전화</dt><dd>{maskMobile(b.snapshot_mobile_last4 as string)}</dd></div><div className="row"><dt>주소</dt><dd className="whitespace-normal text-left">{String(b.snapshot_address)}</dd></div>{b.agent_name ? <div className="row"><dt>대리인</dt><dd>{String(b.agent_name)} ({String(b.agent_relation ?? "")})</dd></div> : null}</dl>)}
          </section>
          <section><h2>등록·인도</h2><dl className="mt-2"><div className="row"><dt>등록</dt><dd>{d?.registration_by === "DELEGATED" ? "위탁(대행)" : d?.registration_by === "BUYER" ? "매수인 직접" : "—"}</dd></div><div className="row"><dt>인도장소</dt><dd>{(d?.delivery_place as string) || "매수인 주소"}</dd></div><div className="row"><dt>인도기한 / 예정일</dt><dd>{d?.delivery_deadline_days != null ? `${d.delivery_deadline_days}일` : "—"} / {(d?.delivery_date as string) ?? "—"}</dd></div></dl></section>
          {da && da.length > 0 && <section><h2>추가할인 승인</h2><ul className="mt-2 text-sm">{da.map((a, i) => <li key={i} className="row"><span>{formatWon(Number(a.amount))}원</span><span className={a.status === "APPROVED" ? "text-ok" : a.status === "REJECTED" ? "text-danger" : "text-warn"}>{a.status}</span></li>)}</ul></section>}
          {isHq(user) && <section><h2>증적</h2>
            <dl className="mt-2 text-sm">
              <div className="row"><dt>계약 payload hash</dt><dd className="break-all font-mono text-xs">{c.payload_hash ?? "—"}</dd></div>
              {(idv ?? []).map((x, i) => <div key={i} className="row"><dt>본인확인 ({x.provider})</dt><dd className="whitespace-normal">{x.verified_name} · ****{x.verified_mobile_last4} · {x.success ? "성공" : "실패"} · {x.verified_at.slice(0, 19).replace("T", " ")}</dd></div>)}
              {(sigs ?? []).map((s, i) => <div key={i} className="row"><dt>서명 {s.signer_role}</dt><dd className="whitespace-normal">{s.signed_at.slice(0, 19).replace("T", " ")}{s.invalidated_at ? <span className="ml-2 text-danger">(무효화)</span> : ""}</dd></div>)}
              {(docs ?? []).map((x, i) => <div key={i} className="row"><dt>PDF {x.doc_type}</dt><dd className="break-all font-mono text-xs">{x.sha256}</dd></div>)}
            </dl>
            {consents && consents.length > 0 && <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[420px] text-xs"><thead className="text-muted"><tr><th className="text-left py-1">동의항목</th><th>매수인</th><th>값</th><th className="text-right">시각</th></tr></thead><tbody>{consents.map((r, i) => <tr key={i} className="border-t border-line"><td className="py-1">{r.consent_key}</td><td className="text-center">{r.buyer_seq}</td><td className="text-center">{r.value}{r.channels?.length ? ` (${r.channels.join(",")})` : ""}</td><td className="text-right num">{r.consented_at.slice(5, 16).replace("T", " ")}</td></tr>)}</tbody></table></div>}
          </section>}
          {isHq(user) && <section><h2>이력</h2><ol className="mt-2 space-y-1 text-sm">{(events ?? []).map((e, i) => <li key={i} className="flex gap-3"><span className="num text-muted">{e.created_at.slice(0, 16).replace("T", " ")}</span><span>{e.event}{e.to_status ? ` → ${e.to_status}` : ""}</span></li>)}</ol></section>}
        </div>
        <div><PriceSummary pricing={p} />{Number(p?.registration_total ?? 0) > 0 && <dl className="mt-3 rounded-md bg-paper p-3 text-xs"><div className="row"><dt>취득세 (감면 후)</dt><dd>{formatWon(Number(p?.acquisition_tax ?? 0))}원</dd></div><div className="row"><dt>공채</dt><dd>{formatWon(Number(p?.bond_cost ?? 0))}원</dd></div><div className="row"><dt>등록대행·번호판</dt><dd>{formatWon(Number(p?.registration_agent_fee ?? 0) + Number(p?.plate_fee ?? 0))}원</dd></div></dl>}<p className="mt-3 text-xs text-muted">영업담당 {c.sales?.name} · {c.dealer?.name ?? "본사"}</p></div>
      </div>
    </div>
  );
}
