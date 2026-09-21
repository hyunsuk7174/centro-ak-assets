"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { prepareUploadAction, registerUploadAction, type UploadTarget } from "@/app/actions/fulfillment";

/** 파일을 브라우저에서 Supabase Storage 로 직접 올린 뒤 서버에 등록 (큰 PDF 도 가능) */
export function UploadBox({ target, label, accept = "application/pdf,image/*", compact }: { target: UploadTarget; label: string; accept?: string; compact?: boolean }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement | null>(null);
  const [state, setState] = useState<"idle" | "uploading" | "done" | "error">("idle");
  const [msg, setMsg] = useState<string | null>(null);

  async function onFile(file: File) {
    setState("uploading"); setMsg(null);
    try {
      if (file.size > 40 * 1024 * 1024) throw new Error("40MB 이하 파일만 올릴 수 있습니다");
      const prep = await prepareUploadAction(target, file.name);
      if (!prep.ok) throw new Error(prep.error);
      const res = await fetch(prep.signedUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type || "application/octet-stream", "x-upsert": "true" } });
      if (!res.ok) throw new Error(`업로드 실패 (${res.status})`);
      const reg = await registerUploadAction(target, prep.path, file.type || "application/octet-stream");
      if (!reg.ok) throw new Error(reg.error);
      setState("done"); setMsg(`${file.name} 업로드 완료`);
      router.refresh();
    } catch (e) { setState("error"); setMsg((e as Error).message); }
    finally { if (ref.current) ref.current.value = ""; }
  }

  return (
    <div className={compact ? "inline-flex flex-col gap-1" : "flex flex-col gap-1"}>
      <button type="button" className={`btn-secondary ${compact ? "h-9 px-3 text-sm" : ""}`} disabled={state === "uploading"} onClick={() => ref.current?.click()}>
        {state === "uploading" ? "올리는 중…" : label}
      </button>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); }} />
      {msg && <span className={`text-xs ${state === "error" ? "text-danger" : "text-ok"}`}>{msg}</span>}
    </div>
  );
}
