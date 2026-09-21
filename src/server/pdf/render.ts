import "server-only";
import { env } from "@/lib/env";
import { existsSync } from "node:fs";

/**
 * HTML → PDF. Vercel(서버리스)에서는 @sparticuz/chromium + puppeteer-core,
 * 로컬에서는 CHROME_PATH(또는 흔한 설치 경로)의 Chrome 을 사용.
 * 꼬리말(전자계약 완료 도장 문구 + 페이지 번호)은 Chromium 의 footerTemplate 으로 찍는다.
 */
async function launch() {
  const puppeteer = (await import("puppeteer-core")).default;
  let executablePath: string | undefined; let args: string[] = []; let headless: boolean | "shell" = true;
  if (process.env.VERCEL || env.NODE_ENV === "production") {
    process.env.AWS_EXECUTION_ENV = process.env.AWS_EXECUTION_ENV || "AWS_Lambda_nodejs20.x";
    const chromium = (await import("@sparticuz/chromium")).default;
    executablePath = await chromium.executablePath();
    args = chromium.args; headless = true;
  } else {
    executablePath = process.env.CHROME_PATH
      ?? ["C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium"].find((p) => existsSync(p));
    args = ["--no-sandbox", "--disable-setuid-sandbox"];
  }
  if (!executablePath) throw new Error("Chrome not found. Set CHROME_PATH in .env.local for local PDF generation.");
  return puppeteer.launch({ executablePath, args, headless });
}

function prepare(html: string) {
  // 폰트에 없는 글자 치환: ㈜ → (주), ①~⑳ → (1)~(20)
  html = html.replace(/㈜/g, "(주)").replace(/[\u2460-\u2473]/g, (c) => `(${c.charCodeAt(0) - 0x2460 + 1})`);
  // 도장 문구를 페이지 안 고정요소(.page::after)에서 빼내어 footerTemplate 으로
  const stampMatch = /\.page::after\s*\{\s*content:\s*"((?:[^"\\]|\\.)*)"[^}]*\}/.exec(html);
  const stamp = stampMatch ? stampMatch[1]!.replace(/\\"/g, '"') : "";
  if (stampMatch) html = html.replace(stampMatch[0], "");
  const fontFace = /@font-face\s*\{[^}]*\}/.exec(html)?.[0] ?? "";
  const footerTemplate = `<style>${fontFace}
    .f { font-family: "KR", sans-serif; font-size: 6.5pt; color: #8a919c; width: 100%; padding: 0 14mm; display: flex; justify-content: space-between; align-items: center; }
  </style><div class="f"><span>${stamp}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  return { html, stamp, footerTemplate };
}

type Browser = Awaited<ReturnType<typeof launch>>;
async function renderOne(browser: Browser, raw: string): Promise<Buffer> {
  const { html, stamp, footerTemplate } = prepare(raw);
  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluateHandle("document.fonts.ready");
    const pdf = await page.pdf({
      format: "A4", printBackground: true, preferCSSPageSize: true,
      margin: { top: "14mm", right: "14mm", bottom: "16mm", left: "14mm" },
      displayHeaderFooter: stamp.length > 0, headerTemplate: "<span></span>", footerTemplate,
    });
    return Buffer.from(pdf);
  } finally { await page.close(); }
}

export async function htmlToPdf(html: string): Promise<Buffer> {
  const browser = await launch();
  try { return await renderOne(browser, html); } finally { await browser.close(); }
}

/** 여러 문서를 브라우저 한 번만 띄워 순서대로 렌더링 (등록서류 묶음용) */
export async function htmlToPdfMany(htmls: string[]): Promise<Buffer[]> {
  const browser = await launch();
  try {
    const out: Buffer[] = [];
    for (const h of htmls) out.push(await renderOne(browser, h));
    return out;
  } finally { await browser.close(); }
}
