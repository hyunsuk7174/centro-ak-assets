"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveAgentAction } from "@/app/actions/fulfillment";
import { UploadBox } from "@/components/fulfillment/UploadBox";
import { MODEL_DOC_TYPES, COMPANY_DOC_TYPES } from "@/server/fulfillment/constants";
import type { ModelDoc } from "@/server/fulfillment/repo";

const file = (p: string) => `/admin/registration/file?path=${encodeURIComponent(p)}`;

export function RegistrationSettings({ docs, agent, isSuper }: { docs: ModelDoc[]; agent: { name: string; rrn: string; address: string }; isSuper: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const find = (scope: "MODEL" | "COMPANY", docType: string, model?: string) => docs.find((d) => d.scope === scope && d.doc_type === docType && (scope === "COMPANY" || d.model_code === model));
  const Row = ({ label, doc, target }: { label: string; doc?: ModelDoc; target: Parameters<typeof UploadBox>[0]["target"] }) => (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line py-2 text-sm first:border-t-0">
      <div><span className="font-medium">{label}</span>{doc ? <a className="ml-3 text-brand underline" href={file(doc.file_path)} target="_blank" rel="noreferrer">{doc.file_path.split("/").pop()}</a> : <span className="ml-3 text-danger">없음</span>}{doc && <span className="ml-2 text-xs text-muted">{doc.uploaded_at.slice(0, 10)}</span>}</div>
      <UploadBox compact target={target} label={doc ? "교체" : "올리기"} />
    </div>
  );
  return (
    <div className="space-y-8">
      <section className="card p-4">
        <h2>위임받은 자 (등록대행 담당자)</h2>
        <p className="mt-1 text-sm text-muted">위임장에 인쇄됩니다. 등록대행 업체 담당자의 성명·주민등록번호·주소를 입력하세요.</p>
        <form className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_2fr_auto]" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); start(async () => { const r = await saveAgentAction(fd); setMsg(r.ok ? "저장했습니다" : r.error); if (r.ok) router.refresh(); }); }}>
          <input name="name" defaultValue={agent.name} placeholder="성명" required disabled={!isSuper} />
          <input name="rrn" defaultValue={agent.rrn} placeholder="주민등록번호 (000000-0000000)" disabled={!isSuper} />
          <input name="address" defaultValue={agent.address} placeholder="주소" disabled={!isSuper} />
          <button className="btn-primary" disabled={pending || !isSuper}>{pending ? "저장 중…" : "저장"}</button>
        </form>
        {msg && <p className="mt-2 text-sm text-ok">{msg}</p>}
      </section>

      <section className="card p-4">
        <h2>회사 공통 서류</h2>
        <p className="mt-1 text-sm text-muted">한 번 올려두면 모든 등록서류 묶음에 자동으로 들어갑니다. PDF 또는 이미지(JPG/PNG).</p>
        <div className="mt-3">{COMPANY_DOC_TYPES.map((t) => <Row key={t.key} label={t.label} doc={find("COMPANY", t.key)} target={{ type: "COMPANY", docType: t.key }} />)}</div>
      </section>

      {(["2VAN", "5VAN"] as const).map((m) => (
        <section key={m} className="card p-4">
          <h2>차종별 서류 — {m}</h2>
          <div className="mt-3">{MODEL_DOC_TYPES.map((t) => <Row key={t.key} label={t.label} doc={find("MODEL", t.key, m)} target={{ type: "MODEL", modelCode: m, docType: t.key }} />)}</div>
        </section>
      ))}

      <section className="card p-4 text-sm text-muted">
        <h2 className="text-ink">묶음에 들어가는 순서</h2>
        <ol className="mt-2 list-decimal space-y-0.5 pl-5">
          <li>위임장 — 시스템 생성, 사용인감 날인</li><li>사용인감계 — 시스템 생성, 사용인감·법인인감 날인</li><li>법인인감증명서 — 원본 별도 (스캔본 올리면 포함)</li><li>사업자등록증 — 위 회사 공통 서류</li><li>저공해자동차 증명서 — 시스템 생성</li><li>수입통관필증 — 차량 재고에서 차대번호별 업로드</li><li>세금계산서 — 계약 상세에서 업로드</li><li>자동차제작증 — 자동차365 발급본 별도 첨부 (표지만 삽입)</li><li>제원관리번호통보서 — 차종별 서류</li><li>배출가스 인증서 — 차종별 서류</li><li>소음 인증서 — 차종별 서류</li><li>고객 신분증 / 사업자등록증 — 계약 상세에서 업로드</li>
        </ol>
      </section>
    </div>
  );
}
