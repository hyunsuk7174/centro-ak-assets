"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addVehiclesAction, deleteVehicleAction } from "@/app/actions/fulfillment";
import { ActionButton } from "@/components/fulfillment/ActionButton";
import { UploadBox } from "@/components/fulfillment/UploadBox";
import type { Vehicle } from "@/server/fulfillment/repo";

const STATUS: Record<string, string> = { STOCK: "재고", ASSIGNED: "배정", DELIVERED: "출고" };
const file = (p: string) => `/admin/registration/file?path=${encodeURIComponent(p)}`;

export function StockTable({ rows, isSuper }: { rows: (Vehicle & { contract: { contract_no: string } | null })[]; isSuper: boolean }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("");
  const shown = rows.filter((r) => !filter || r.status === filter);
  return (
    <div className="space-y-6">
      <form className="card p-4" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const form = e.currentTarget; start(async () => { setMsg(null); const r = await addVehiclesAction(fd); setMsg(r.ok ? (r.message ?? "등록") : r.error); if (r.ok) { form.reset(); router.refresh(); } }); }}>
        <h2>차량 등록 (여러 대 한 번에)</h2>
        <p className="mt-1 text-sm text-muted">한 줄에 한 대. 순서: <b>차대번호, 차종(2VAN/5VAN/2VAN BE/5VAN BE), 색상, 연식, 제작연월일, 입항일</b> — 쉼표로 구분. 엑셀에서 열을 복사해 붙여넣어도 됩니다. 차대번호와 차종만 있어도 등록됩니다.</p>
        <textarea name="lines" rows={5} className="mt-3 font-mono text-sm" placeholder={"L3H3CDBD6TA000078, 2VAN, 스노우 화이트, 2026, 2026-09-04, 2026-09-10\nL3H3CDBD6TA000079, 5VAN BE, 블랙 펄, 2026, 2026-09-04"} />
        <div className="mt-3 flex items-center gap-3"><button className="btn-primary" disabled={pending}>{pending ? "등록 중…" : "등록"}</button>{msg && <span className={`text-sm ${msg.includes("오류") || msg.includes("이미") ? "text-danger" : "text-ok"}`}>{msg}</span>}</div>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        {["", "STOCK", "ASSIGNED", "DELIVERED"].map((s) => <button key={s} type="button" onClick={() => setFilter(s)} className={`badge cursor-pointer border ${filter === s ? "border-brand bg-brand text-white" : "border-line bg-white text-muted"}`}>{s ? STATUS[s] : "전체"} {rows.filter((r) => !s || r.status === s).length}</button>)}
      </div>

      <div className="space-y-3 sm:hidden">
        {shown.map((v) => <div key={v.id} className="card p-4 text-sm"><div className="flex justify-between"><span className="font-mono font-semibold">{v.vin}</span><span className="badge bg-paper">{STATUS[v.status]}</span></div><div className="mt-1 text-muted">{v.model_code}{v.edition ? ` ${v.edition}` : ""} · {v.color ?? "-"} · {v.model_year ?? ""}</div><div className="text-muted">제작 {v.mfg_date ?? "-"} · 입항 {v.import_date ?? "-"}{v.contract ? ` · 계약 ${v.contract.contract_no}` : ""}</div><div className="mt-2 flex flex-wrap gap-2">{v.customs_doc_path ? <a className="text-brand underline" href={file(v.customs_doc_path)} target="_blank" rel="noreferrer">통관필증</a> : null}<UploadBox compact target={{ type: "CUSTOMS", vehicleId: v.id }} label={v.customs_doc_path ? "통관필증 교체" : "통관필증 올리기"} />{isSuper && v.status === "STOCK" && <ActionButton className="btn-ghost h-9 px-2 text-xs" label="삭제" run={() => deleteVehicleAction(v.id)} confirm="이 차량을 삭제할까요?" />}</div></div>)}
      </div>
      <div className="card hidden overflow-x-auto sm:block">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-paper text-left text-xs uppercase tracking-wide text-muted"><tr><th className="py-3 pl-4 pr-4">차대번호</th><th className="pr-4">차종</th><th className="pr-4">색상</th><th className="pr-4">연식</th><th className="pr-4">제작연월일</th><th className="pr-4">입항일</th><th className="pr-4">상태</th><th className="pr-4">계약</th><th className="pr-4">통관필증</th><th /></tr></thead>
          <tbody>
            {shown.length === 0 && <tr><td colSpan={10} className="py-12 text-center text-muted">등록된 차량이 없습니다.</td></tr>}
            {shown.map((v) => <tr key={v.id} className="border-t border-line">
              <td className="py-2.5 pl-4 pr-4 font-mono">{v.vin}</td><td className="pr-4 whitespace-nowrap">{v.model_code}{v.edition ? ` ${v.edition}` : ""}</td><td className="pr-4">{v.color ?? "-"}</td><td className="pr-4 num">{v.model_year ?? ""}</td><td className="pr-4 num">{v.mfg_date ?? "-"}</td><td className="pr-4 num">{v.import_date ?? "-"}</td>
              <td className="pr-4"><span className="badge bg-paper">{STATUS[v.status]}</span></td><td className="pr-4">{v.contract?.contract_no ?? ""}</td>
              <td className="pr-4"><div className="flex items-center gap-2">{v.customs_doc_path && <a className="text-brand underline" href={file(v.customs_doc_path)} target="_blank" rel="noreferrer">보기</a>}<UploadBox compact target={{ type: "CUSTOMS", vehicleId: v.id }} label={v.customs_doc_path ? "교체" : "올리기"} /></div></td>
              <td className="pr-3 text-right">{isSuper && v.status === "STOCK" && <ActionButton className="btn-ghost h-8 px-2 text-xs" label="삭제" run={() => deleteVehicleAction(v.id)} confirm="이 차량을 삭제할까요?" />}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
  );
}
