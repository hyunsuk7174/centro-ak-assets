/**
 * 출고·등록 서류 HTML 템플릿 (순수 함수). Chromium 으로 A4 PDF 렌더링.
 * 도장 이미지는 base64 로 주입 (assets/seals — 공개 폴더가 아님).
 */
export interface Company { name: string; ceo: string; bizNo: string; address: string }
export const COMPANY: Company = { name: "주식회사 센트로에이케이", ceo: "김은옥", bizNo: "434-81-02909", address: "경기도 평택시 진위면 서탄로 69" };

export interface Seals { corporate: string; usage: string; nameplate: string } // base64 PNG
export interface Agent { name: string; rrn: string; address: string }
export interface VehicleInfo { modelCode: "2VAN" | "5VAN"; modelName: string; vin: string; color?: string | null; modelYear?: number | null; edition?: string | null }
export interface BuyerInfo { name: string; type: string; idNo?: string; address?: string; mobile?: string }
export interface PaymentRow { kind: string; amount: number; paidAt: string; payerName?: string | null; memo?: string | null }

const esc = (s: unknown) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const won = (n: number) => Number(n).toLocaleString("ko-KR");
const KIND: Record<string, string> = { DEPOSIT: "계약금", BALANCE: "잔금", FINANCE: "할부금융 실행", OTHER: "기타" };
export const todayK = (d = new Date()) => { const k = new Date(d.getTime() + 9 * 3600_000); return { y: k.getUTCFullYear(), m: String(k.getUTCMonth() + 1).padStart(2, "0"), d: String(k.getUTCDate()).padStart(2, "0") }; };
const dateLine = (d = new Date()) => { const t = todayK(d); return `${t.y}년 ${t.m}월 ${t.d}일`; };

function shell(font: string, body: string, extraCss = "") {
  return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><style>
@font-face { font-family: "KR"; src: url(data:font/opentype;base64,${font}) format("opentype"); }
@page { size: A4; margin: 14mm 14mm 16mm 14mm; }
* { box-sizing: border-box; } html, body { margin: 0; padding: 0; }
body { font-family: "KR", "Noto Sans KR", sans-serif; color: #111; font-size: 11pt; line-height: 1.6; }
table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #222; padding: 6px 10px; font-size: 11pt; }
th { font-weight: 600; text-align: center; background: #fff; }
.title { text-align: center; font-size: 26pt; font-weight: 700; letter-spacing: .35em; margin: 10mm 0 14mm; }
.center { text-align: center; } .right { text-align: right; }
.seal { position: relative; display: inline-block; }
.seal img { position: absolute; }
.frame { border: 1.5px solid #222; padding: 14mm 12mm; min-height: 250mm; }
.box { border: 1.5px solid #222; padding: 8px 12px; }
.muted { color: #555; font-size: 9.5pt; }
${extraCss}
</style></head><body>${body}</body></html>`;
}

/** 1. 위임장 (등록대행 담당자에게 신규등록 일체 위임, 사용인감 날인) */
export function delegationHtml(font: string, seals: Seals, agent: Agent, v: VehicleInfo) {
  return shell(font, `
<div class="frame">
  <div class="title">위 임 장</div>
  <table style="margin-top:6mm">
    <tr><th rowspan="2" style="width:22%">위임받은 자<br/>(오신분)</th><th style="width:12%">성 명</th><td style="width:26%">${esc(agent.name)}</td><th style="width:16%">주민등록번호</th><td>${esc(agent.rrn)}</td></tr>
    <tr><th>주 소</th><td colspan="3">${esc(agent.address)}</td></tr>
  </table>
  <p style="margin:14mm 0 0; font-size:12pt; line-height:1.9; word-break:keep-all">
    차대번호 <u><b>&nbsp;${esc(v.vin)}&nbsp;</b></u> 호 자동차의 [1. 소유권 이전 &nbsp;2. 변경 &nbsp;<b>3. 신규</b> &nbsp;4. 임판발급 &nbsp;5. 등록증재교부 &nbsp;6. 말소 &nbsp;7. 근저당 설정 &nbsp;8. 근저당말소 ] 신청에 관한 일체의 행위를 위 위임받은 자에게 위임합니다.
  </p>
  <p class="muted" style="margin:2mm 0 0">차명: ${esc(v.modelName)}${v.color ? ` · 색상: ${esc(v.color)}` : ""}</p>
  <p class="center" style="margin:16mm 0 0; font-size:12pt">${dateLine()}</p>
  <p class="center" style="margin:10mm 0 0; font-size:15pt; font-weight:600">
    <span class="seal">${esc(COMPANY.name)}<img src="data:image/png;base64,${seals.usage}" style="width:22mm; right:-16mm; top:-8mm" alt="사용인감" /></span>
  </p>
  <div class="box" style="margin-top:22mm">
    <b>※ 유의사항</b><br/>
    타인의 서명 또는 인장의 도용 등으로 허위의 위임장을 작성하여 증명서의 신청 또는 수령한 경우는 「형법」 제231조 또는 제237조의 2에 따라 5년 이하의 징역 또는 1천만원 이하의 벌금형에 처해집니다.
  </div>
</div>`);
}

/** 2. 사용인감계 (사용인감 + 법인인감 날인) */
export function sealDeclarationHtml(font: string, seals: Seals) {
  return shell(font, `
<div class="frame">
  <div class="title" style="margin-top:14mm">사 용 인 감 계</div>
  <div style="width:70mm; margin: 12mm auto 0; border:1.5px solid #222">
    <div style="border-bottom:1.5px solid #222; text-align:center; padding:6px; font-size:13pt; letter-spacing:.3em">사 용 인 감</div>
    <div style="height:50mm; display:flex; align-items:center; justify-content:center"><img src="data:image/png;base64,${seals.usage}" style="width:26mm" alt="사용인감" /></div>
  </div>
  <p style="margin:22mm 0 0; font-size:12pt; line-height:2; word-break:keep-all">&nbsp;&nbsp;위의 사용인감을 당사의 사용인감임을 확인하고 이에 사용인감계를 제출합니다.</p>
  <p class="center" style="margin:16mm 0 0; font-size:12pt">${dateLine()}</p>
  <p class="center" style="margin:16mm 0 0; font-size:15pt; font-weight:600; line-height:2.2">
    ${esc(COMPANY.name)}<br/>
    <span class="seal">대표이사 ${esc(COMPANY.ceo)}<img src="data:image/png;base64,${seals.corporate}" style="width:22mm; right:-18mm; top:-6mm" alt="법인인감" /></span>
  </p>
</div>`);
}

/** 5. 저공해자동차 증명서 [별지 제1호서식] */
export function lowEmissionHtml(font: string, seals: Seals, v: VehicleInfo, certNo: string) {
  const chk = (on: boolean, l: string) => `<span style="display:inline-block; margin-right:10px">${on ? "√" : "□"} ${esc(l)}</span>`;
  return shell(font, `
<p style="margin:0; color:#1a5aa6; font-size:10pt">[별지 제1호서식]</p>
<div style="border-top:2px solid #6dbb9b; margin-top:10mm"></div>
<div style="border:1.5px solid #8a9aa5; padding:12mm 10mm; margin-top:4mm; min-height:230mm">
  <div class="title" style="color:#1d6b5a; letter-spacing:.1em; font-size:24pt; margin:4mm 0 12mm">저공해자동차 증명서</div>
  <table style="border-color:#8a9aa5">
    <tr><th style="width:30%; background:#f3f6f8; border-color:#8a9aa5">자동차 명칭</th><td style="border-color:#8a9aa5; font-size:12pt">${esc(v.modelName)}</td></tr>
    <tr><th style="background:#f3f6f8; border-color:#8a9aa5">차대번호</th><td style="border-color:#8a9aa5; font-size:12pt; letter-spacing:.05em">${esc(v.vin)}</td></tr>
    <tr><th style="background:#f3f6f8; border-color:#8a9aa5">인증번호</th><td style="border-color:#8a9aa5; font-size:12pt">${esc(certNo)}</td></tr>
    <tr><th style="background:#f3f6f8; border-color:#8a9aa5">저공해 자동차 종류</th><td style="border-color:#8a9aa5">${chk(true, "1종")}${chk(false, "2종")}${chk(false, "3종")}</td></tr>
    <tr><th style="background:#f3f6f8; border-color:#8a9aa5">사용연료</th><td style="border-color:#8a9aa5; line-height:2.2">${chk(false, "휘발유")}${chk(false, "경유")}${chk(false, "액화천연가스")}<br/>${chk(false, "액화석유가스")}${chk(false, "하이브리드")}<br/>${chk(false, "수소")}${chk(true, "전기")}${chk(false, "기타 (        )")}</td></tr>
  </table>
  <p class="center" style="margin:14mm 0 0; font-size:12.5pt; line-height:2">저공해 자동차 표지등에 관한 제5조 제1항의 규정에 의하여<br/>위와 같이 저공해 자동차임을 증명합니다.</p>
  <p class="center" style="margin:12mm 0 0; font-size:12.5pt">${dateLine()}</p>
  <p class="center" style="margin:12mm 0 0; font-size:14pt"><span class="seal">${esc(COMPANY.name)} &nbsp; 대표 ${esc(COMPANY.ceo)}<img src="data:image/png;base64,${seals.usage}" style="width:18mm; right:-14mm; top:-5mm" alt="인" /></span></p>
</div>
<p class="right muted" style="margin-top:4mm">210㎜×297㎜[일반용지 60g/㎡(재활용품)]</p>`);
}

/** 입금확인서 (고객용) */
export function paymentConfirmationHtml(font: string, seals: Seals, contractNo: string, buyer: BuyerInfo, v: VehicleInfo | null, rows: PaymentRow[], salePrice: number, vehicleLabel: string) {
  const total = rows.reduce((s, r) => s + Number(r.amount), 0);
  const remain = Math.max(0, salePrice - total);
  return shell(font, `
<div class="frame">
  <div class="title" style="letter-spacing:.2em">입 금 확 인 서</div>
  <table>
    <tr><th style="width:22%">계약번호</th><td style="width:28%">${esc(contractNo)}</td><th style="width:22%">발행일</th><td>${dateLine()}</td></tr>
    <tr><th>매수인</th><td>${esc(buyer.name)}</td><th>연락처</th><td>${esc(buyer.mobile ?? "")}</td></tr>
    <tr><th>차량</th><td colspan="3">${esc(vehicleLabel)}${v?.vin ? ` · 차대번호 ${esc(v.vin)}` : ""}</td></tr>
    <tr><th>판매가격</th><td colspan="3" class="right">${won(salePrice)} 원</td></tr>
  </table>
  <table style="margin-top:8mm">
    <tr><th style="width:22%">구분</th><th style="width:22%">입금일</th><th>입금자명</th><th style="width:26%">금액</th></tr>
    ${rows.map((r) => `<tr><td class="center">${esc(KIND[r.kind] ?? r.kind)}</td><td class="center">${esc(r.paidAt)}</td><td>${esc(r.payerName ?? "")}${r.memo ? ` <span class="muted">(${esc(r.memo)})</span>` : ""}</td><td class="right">${won(Number(r.amount))} 원</td></tr>`).join("")}
    <tr><th colspan="3">입금 합계</th><td class="right"><b>${won(total)} 원</b></td></tr>
    <tr><th colspan="3">미수금</th><td class="right">${won(remain)} 원</td></tr>
  </table>
  <p style="margin:14mm 0 0; font-size:12pt; line-height:2; word-break:keep-all">위 계약에 대한 대금이 위와 같이 입금되었음을 확인합니다.${remain === 0 ? " (대금 완납)" : ""}</p>
  <p class="center" style="margin:16mm 0 0; font-size:12pt">${dateLine()}</p>
  <div style="display:flex; justify-content:flex-end; align-items:center; gap:10mm; margin-top:12mm">
    <div style="font-size:12pt; line-height:1.8; text-align:right">${esc(COMPANY.name)}<br/>사업자등록번호 ${esc(COMPANY.bizNo)}<br/>${esc(COMPANY.address)}</div>
    <img src="data:image/png;base64,${seals.nameplate}" style="height:22mm" alt="명판·직인" />
  </div>
</div>`);
}

/** 출고증 (고객·탁송용) */
export function releaseNoteHtml(font: string, seals: Seals, contractNo: string, buyer: BuyerInfo, v: VehicleInfo, vehicleLabel: string, deliveryPlace: string, releaseDate: string, salesName: string, salesPhone: string) {
  return shell(font, `
<div class="frame">
  <div class="title" style="letter-spacing:.3em">출 고 증</div>
  <table>
    <tr><th style="width:22%">계약번호</th><td style="width:28%">${esc(contractNo)}</td><th style="width:22%">출고일</th><td>${esc(releaseDate)}</td></tr>
    <tr><th>차명</th><td>${esc(vehicleLabel)}</td><th>색상</th><td>${esc(v.color ?? "")}</td></tr>
    <tr><th>차대번호</th><td colspan="3" style="font-size:13pt; letter-spacing:.06em"><b>${esc(v.vin)}</b></td></tr>
    <tr><th>연식</th><td>${esc(v.modelYear ?? "")}</td><th>구분</th><td>신차 · 전기(EV)</td></tr>
  </table>
  <table style="margin-top:8mm">
    <tr><th style="width:22%">인수인(매수인)</th><td style="width:28%">${esc(buyer.name)}</td><th style="width:22%">연락처</th><td>${esc(buyer.mobile ?? "")}</td></tr>
    <tr><th>인도장소</th><td colspan="3">${esc(deliveryPlace)}</td></tr>
    <tr><th>영업담당</th><td colspan="3">${esc(salesName)}${salesPhone ? ` (${esc(salesPhone)})` : ""}</td></tr>
  </table>
  <p style="margin:12mm 0 0; font-size:12pt; line-height:2; word-break:keep-all">위 차량을 매매계약(${esc(contractNo)})에 따라 대금 완납을 확인하고 출고합니다. 인수 시 차량 외관·부속품·서류를 확인해 주시기 바랍니다.</p>
  <table style="margin-top:10mm"><tr><th style="width:50%; height:26mm; vertical-align:top; text-align:left">인수인 서명<br/><span class="muted">(인수 후 서명)</span></th><th style="vertical-align:top; text-align:left">비고</th></tr></table>
  <p class="center" style="margin:14mm 0 0; font-size:12pt">${dateLine()}</p>
  <div style="display:flex; justify-content:flex-end; align-items:center; gap:10mm; margin-top:10mm">
    <div style="font-size:12pt; line-height:1.8; text-align:right">${esc(COMPANY.name)}<br/>${esc(COMPANY.address)}</div>
    <img src="data:image/png;base64,${seals.nameplate}" style="height:22mm" alt="명판·직인" />
  </div>
</div>`);
}

/** 묶음 안에 끼우는 표지(원본 별도 첨부 안내) */
export function separatorHtml(font: string, no: number, title: string, note: string) {
  return shell(font, `
<div class="frame" style="display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center">
  <div style="font-size:14pt; color:#555">등록서류 ${no}</div>
  <div style="font-size:30pt; font-weight:700; margin:8mm 0">${esc(title)}</div>
  <div style="font-size:13pt; color:#c0392b">${esc(note)}</div>
</div>`);
}
