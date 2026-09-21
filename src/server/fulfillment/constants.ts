/** 클라이언트/서버 공용 상수 (server-only 아님) */
export type ModelCode = "2VAN" | "5VAN";
/** 차종별 등록 기준 데이터 (제원통보서·인증서 기준) */
export const MODEL_INFO: Record<ModelCode, { name: (year: number | null) => string; emissionCertNo: string; noiseCertNo: string; specNo: string | null }> = {
  "2VAN": { name: (y) => `${y ?? 2026} E-CV1 2VAN`, emissionCertNo: "RMY-CT-21-1", noiseCertNo: "RPEV-CT-1", specNo: "00W-2-00004-0000-3125" },
  "5VAN": { name: (y) => `${y ?? 2026} E-CV1 5VAN`, emissionCertNo: "RMY-CT-21-1", noiseCertNo: "RPEV-CT-1", specNo: null },
};
export const MODEL_DOC_TYPES = [
  { key: "SPEC_NOTICE", label: "제원관리번호통보서" },
  { key: "EMISSION_CERT", label: "배출가스 인증서" },
  { key: "NOISE_CERT", label: "소음 인증서" },
] as const;
export const COMPANY_DOC_TYPES = [
  { key: "BIZ_CERT", label: "사업자등록증" },
  { key: "CORP_SEAL_CERT", label: "법인인감증명서 (스캔본, 선택)" },
] as const;
export const ATTACHMENT_TYPES = [
  { key: "TAX_INVOICE", label: "세금계산서 (고객 발급용)" },
  { key: "ID_CARD", label: "고객 신분증" },
  { key: "BUYER_BIZ_CERT", label: "고객 사업자등록증" },
  { key: "OTHER", label: "기타" },
] as const;

