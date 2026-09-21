import { NextResponse, type NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { storage, BUCKETS } from "@/server/storage";

/** 본사 전용 파일 보기/다운로드: /admin/registration/file?path=<storage path>&dl=1 */
export async function GET(req: NextRequest) {
  await requireUser("SUPER_ADMIN", "HQ_STAFF");
  const p = req.nextUrl.searchParams.get("path") ?? "";
  if (!p || p.includes("..")) return new NextResponse("bad path", { status: 400 });
  try {
    const buf = await storage.get(BUCKETS.docs, p);
    const name = p.split("/").pop() ?? "file";
    const ext = name.toLowerCase().split(".").pop() ?? "";
    const type = ext === "pdf" ? "application/pdf" : ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "application/octet-stream";
    const dl = req.nextUrl.searchParams.get("dl") === "1";
    return new NextResponse(new Uint8Array(buf), { headers: { "Content-Type": type, "Content-Disposition": `${dl ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(name)}`, "Cache-Control": "private, no-store" } });
  } catch { return new NextResponse("not found", { status: 404 }); }
}
