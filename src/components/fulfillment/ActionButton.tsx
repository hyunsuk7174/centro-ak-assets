"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Result = { ok: true; message?: string; filePath?: string } | { ok: false; error: string };

/** 서버 액션 실행 버튼: 진행 표시 + 결과 메시지 + (있으면) 생성 파일 열기 링크 */
export function ActionButton({ run, label, pendingLabel, className = "btn-secondary", confirm: confirmText, fileLabel = "파일 열기" }: { run: () => Promise<Result>; label: string; pendingLabel?: string; className?: string; confirm?: string; fileLabel?: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [res, setRes] = useState<Result | null>(null);
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" className={className} disabled={pending} onClick={() => {
        if (confirmText && !window.confirm(confirmText)) return;
        start(async () => { setRes(null); const r = await run(); setRes(r); if (r.ok) router.refresh(); });
      }}>{pending ? (pendingLabel ?? "처리 중…") : label}</button>
      {res && !res.ok && <span className="text-sm text-danger">{res.error}</span>}
      {res && res.ok && res.message && <span className="text-sm text-ok">{res.message}</span>}
      {res && res.ok && res.filePath && <a className="text-sm font-medium text-brand underline" href={`/admin/registration/file?path=${encodeURIComponent(res.filePath)}`} target="_blank" rel="noreferrer">{fileLabel}</a>}
    </span>
  );
}
