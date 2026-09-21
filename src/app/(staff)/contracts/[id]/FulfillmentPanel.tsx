"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { assignVinAction, unassignVinAction, markDeliveredAction, addPaymentAction, deletePaymentAction, deleteAttachmentAction, generateBundleAction, generateCustomerDocAction } from "@/app/actions/fulfillment";
import { ActionButton } from "@/components/fulfillment/ActionButton";
import { UploadBox } from "@/components/fulfillment/UploadBox";
import type { Vehicle, Payment, Attachment, Bundle } from "@/server/fulfillment/repo";

const KIND: Record<string, string> = { DEPOSIT: "계약금", BALANCE: "잔금", FINANCE: "할부금융 실행", OTHER: "기타" };
const ATT: Record<string, string> = { TAX_INVOICE: "세금계산서", ID_CARD: "고객 신분증", BUYER_BIZ_CERT: "고객 사업자등록증", OTHER: "기타" };
const won = (n: number) => Number(n).toLocaleString("ko-KR");
const file = (p: string) => `/admin/registration/file?path=${encodeURIComponent(p)}`;

export function FulfillmentPanel({ contractId, contractNo, isSuper, modelCode, salePrice, deposit, vehicle, stock, payments, attachments, bundles, agentReady, isInstallment }: {
  contractId: string; contractNo: string; isSuper: boolean; modelCode: "2VAN" | "5VAN" | null; salePrice: number; deposit: number;
  vehicle: Vehicle | null; stock: Vehicle[]; payments: Payment[]; attachments: Attachment[]; bundles: Bundle[]; agentReady: boolean; isInstallment: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [pick, setPick] = useState("");
  const [payMsg, setPayMsg] = useState<string | null>(null);
  const paid = payments.reduce((s, p) => s + Number(p.amount), 0);
  const remain = Math.max(0, salePrice - paid);
  const paidInFull = salePrice > 0 && remain === 0;
  const candidates = stock.filter((v) => !modelCode || v.model_code === modelCode);
  const bundleList = bundles.filter((b) => (b.doc_list as { kind?: string })?.kind === "BUNDLE");
  const otherDocs = bundles.filter((b) => (b.doc_list as { kind?: string })?.kind !== "BUNDLE");

  return (
    <section className="rounded-md border border-line bg-paper p-4 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2>출고 · 등록</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={`badge ${vehicle ? "bg-ok/10 text-ok" : "bg-white text-muted"}`}>차대번호 {vehicle ? "배정" : "미배정"}</span>
          <span className={`badge ${paidInFull ? "bg-ok/10 text-ok" : "bg-white text-muted"}`}>{paidInFull ? "대금 완납" : `미수금 ${won(remain)}원`}</span>
          <span className={`badge ${vehicle?.status === "DELIVERED" ? "bg-ok/10 text-ok" : "bg-white text-muted"}`}>{vehicle?.status === "DELIVERED" ? "출고 완료" : "출고 전"}</span>
        </div>
      </div>

      {/* 1. 차대번호 */}
      <div>
        <h3 className="text-sm font-semibold">1. 차대번호 배정</h3>
        {vehicle ? (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded bg-white px-3 py-1.5 font-mono text-[15px] tracking-wide">{vehicle.vin}</span>
            <span className="text-muted">{vehicle.model_code}{vehicle.edition ? ` ${vehicle.edition}` : ""} · {vehicle.color ?? "-"} · 제작 {vehicle.mfg_date ?? "-"}</span>
            {vehicle.customs_doc_path ? <a className="text-brand underline" href={file(vehicle.customs_doc_path)} target="_blank" rel="noreferrer">통관필증 보기</a> : <span className="text-danger">통관필증 없음 (차량 재고에서 업로드)</span>}
            {vehicle.status !== "DELIVERED" && <ActionButton className="btn-ghost h-9 text-sm" label="배정 해제" run={() => unassignVinAction(contractId)} confirm="차대번호 배정을 해제할까요?" />}
          </div>
        ) : (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <select className="w-auto min-w-[260px]" value={pick} onChange={(e) => setPick(e.target.value)}>
              <option value="">재고 차량 선택 ({candidates.length}대)</option>
              {candidates.map((v) => <option key={v.id} value={v.id}>{v.vin} · {v.model_code}{v.edition ? " BE" : ""} · {v.color ?? "-"}{v.customs_doc_path ? "" : " · 통관필증 없음"}</option>)}
            </select>
            <ActionButton className="btn-primary" label="이 차량 배정" run={async () => pick ? assignVinAction(contractId, pick) : { ok: false, error: "차량을 선택하세요" }} />
            {candidates.length === 0 && <span className="text-sm text-muted">재고가 없습니다. 차량 재고 메뉴에서 먼저 등록하세요.</span>}
          </div>
        )}
      </div>

      {/* 2. 입금 */}
      <div>
        <h3 className="text-sm font-semibold">2. 입금 확인 <span className="font-normal text-muted">(판매가격 {won(salePrice)}원 · 계약금 {won(deposit)}원{isInstallment ? " · 할부" : ""})</span></h3>
        {payments.length > 0 && (
          <table className="mt-2 w-full text-sm">
            <thead className="text-xs text-muted"><tr><th className="py-1 text-left">구분</th><th className="text-left">입금일</th><th className="text-left">입금자</th><th className="text-right">금액</th><th /></tr></thead>
            <tbody>{payments.map((p) => <tr key={p.id} className="border-t border-line"><td className="py-1.5">{KIND[p.kind]}</td><td className="num">{p.paid_at}</td><td>{p.payer_name ?? ""}{p.memo ? <span className="text-muted"> ({p.memo})</span> : ""}</td><td className="num text-right">{won(p.amount)}</td><td className="text-right">{isSuper && <ActionButton className="btn-ghost h-8 px-2 text-xs" label="삭제" run={() => deletePaymentAction(contractId, p.id)} confirm="이 입금 기록을 삭제할까요?" />}</td></tr>)}
              <tr className="border-t border-line font-semibold"><td className="py-1.5" colSpan={3}>합계 / 미수금</td><td className="num text-right">{won(paid)} / {won(remain)}</td><td /></tr>
            </tbody>
          </table>
        )}
        <form className="mt-3 grid gap-2 sm:grid-cols-[130px_150px_1fr_1fr_auto]" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const form = e.currentTarget; start(async () => { setPayMsg(null); const r = await addPaymentAction(contractId, fd); if (!r.ok) setPayMsg(r.error); else { form.reset(); router.refresh(); } }); }}>
          <select name="kind" defaultValue={payments.length === 0 ? "DEPOSIT" : isInstallment ? "FINANCE" : "BALANCE"} className="h-10">
            <option value="DEPOSIT">계약금</option><option value="BALANCE">잔금</option><option value="FINANCE">할부금융 실행</option><option value="OTHER">기타</option>
          </select>
          <input name="paid_at" type="date" required className="h-10" defaultValue={new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10)} />
          <input name="amount" inputMode="numeric" placeholder="금액 (원)" required className="h-10" defaultValue={payments.length === 0 && deposit ? String(deposit) : remain ? String(remain) : ""} />
          <input name="payer_name" placeholder="입금자명" className="h-10" />
          <button className="btn-primary h-10 px-4" disabled={pending}>{pending ? "저장 중…" : "입금 기록"}</button>
          <input name="memo" placeholder="메모 (선택: 금융사, 은행, 비고)" className="h-10 sm:col-span-5" />
        </form>
        {payMsg && <p className="mt-1 text-sm text-danger">{payMsg}</p>}
        <div className="mt-3 flex flex-wrap gap-2">
          <ActionButton label="입금확인서 만들기" run={() => generateCustomerDocAction(contractId, "PAYMENT")} pendingLabel="만드는 중… (10초)" fileLabel="입금확인서 열기" />
          <ActionButton label="출고증 만들기" run={() => generateCustomerDocAction(contractId, "RELEASE")} pendingLabel="만드는 중… (10초)" fileLabel="출고증 열기" />
          {vehicle && vehicle.status !== "DELIVERED" && <ActionButton label="출고 완료 처리" run={() => markDeliveredAction(contractId)} confirm="이 계약 차량을 출고 완료로 표시할까요?" />}
        </div>
      </div>

      {/* 3. 계약 첨부 */}
      <div>
        <h3 className="text-sm font-semibold">3. 계약별 첨부 <span className="font-normal text-muted">(세금계산서 · 고객 신분증 / 사업자등록증)</span></h3>
        {attachments.length > 0 && <ul className="mt-2 space-y-1 text-sm">{attachments.map((a) => <li key={a.id} className="flex flex-wrap items-center gap-3"><span className="w-32 text-muted">{ATT[a.doc_type]}</span><a className="text-brand underline" href={file(a.file_path)} target="_blank" rel="noreferrer">{a.file_path.split("/").pop()}</a><ActionButton className="btn-ghost h-8 px-2 text-xs" label="삭제" run={() => deleteAttachmentAction(contractId, a.id)} confirm="첨부를 삭제할까요?" /></li>)}</ul>}
        <div className="mt-2 flex flex-wrap gap-2">
          <UploadBox compact target={{ type: "ATTACHMENT", contractId, docType: "TAX_INVOICE" }} label="세금계산서 올리기" />
          <UploadBox compact target={{ type: "ATTACHMENT", contractId, docType: "ID_CARD" }} label="신분증 올리기" accept="image/*,application/pdf" />
          <UploadBox compact target={{ type: "ATTACHMENT", contractId, docType: "BUYER_BIZ_CERT" }} label="고객 사업자등록증 올리기" accept="image/*,application/pdf" />
        </div>
      </div>

      {/* 4. 등록서류 묶음 */}
      <div>
        <h3 className="text-sm font-semibold">4. 등록서류 일괄 생성 <span className="font-normal text-muted">(위임장 → 사용인감계 → 법인인감증명서 → 사업자등록증 → 저공해증명서 → 통관필증 → 세금계산서 → 제작증 → 제원통보서 → 배출가스 → 소음 → 고객 신분증)</span></h3>
        {!agentReady && <p className="mt-1 text-sm text-danger">등록서류 설정에서 위임받은 자(등록대행 담당자) 정보를 먼저 입력하세요.</p>}
        {isSuper ? (
          <div className="mt-2">
            <ActionButton className="btn-primary" label="등록서류 PDF 한 번에 만들기" pendingLabel="서류 만드는 중… (20~40초)" run={() => generateBundleAction(contractId)} fileLabel="묶음 PDF 열기 · 인쇄" />
            {!vehicle && <p className="mt-1 text-xs text-muted">차대번호를 먼저 배정해야 만들 수 있습니다.</p>}
          </div>
        ) : <p className="mt-1 text-sm text-muted">등록서류 생성은 최고관리자만 할 수 있습니다.</p>}
        {(bundleList.length > 0 || otherDocs.length > 0) && (
          <ul className="mt-3 space-y-1 text-sm">
            {bundleList.map((b) => { const d = b.doc_list as { items?: { no: number; title: string; source: string }[]; vin?: string }; const miss = (d.items ?? []).filter((i) => i.source === "누락(표지)"); return (
              <li key={b.id} className="flex flex-wrap items-center gap-3"><span className="text-muted num">{b.generated_at.slice(0, 16).replace("T", " ")}</span><a className="font-medium text-brand underline" href={file(b.file_path)} target="_blank" rel="noreferrer">등록서류 묶음 ({d.vin ?? ""})</a><a className="text-muted underline" href={`${file(b.file_path)}&dl=1`}>다운로드</a>{miss.length > 0 && <span className="text-xs text-warn">누락: {miss.map((m) => m.title).join(", ")}</span>}</li>); })}
            {otherDocs.map((b) => { const k = (b.doc_list as { kind?: string })?.kind; return <li key={b.id} className="flex flex-wrap items-center gap-3"><span className="text-muted num">{b.generated_at.slice(0, 16).replace("T", " ")}</span><a className="text-brand underline" href={file(b.file_path)} target="_blank" rel="noreferrer">{k === "PAYMENT" ? "입금확인서" : k === "RELEASE" ? "출고증" : "문서"}</a></li>; })}
          </ul>
        )}
      </div>
      <p className="text-xs text-muted">계약번호 {contractNo} · 이 영역은 본사에만 보입니다.</p>
    </section>
  );
}
