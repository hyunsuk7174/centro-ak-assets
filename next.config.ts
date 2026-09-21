import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
// 개발 모드는 Next.js HMR/react-refresh 가 eval 을 사용하므로 unsafe-eval 허용. 운영 빌드에는 포함되지 않음.
// 카카오(다음) 우편번호 서비스 — 검색창은 postcode.map.kakao.com (구 postcode.map.daum.net), 스크립트·이미지는 *.daumcdn.net
const kakao = "https://postcode.map.kakao.com https://postcode.map.daum.net https://t1.daumcdn.net https://*.daumcdn.net https://*.kakao.com";
const scriptSrc = isDev ? "'self' 'unsafe-inline' 'unsafe-eval'" : "'self' 'unsafe-inline'";
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Content-Security-Policy",
    value:
      `default-src 'self'; script-src ${scriptSrc} ${kakao}; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net ${kakao}; img-src 'self' data: blob: ${kakao}; font-src 'self' data: https://cdn.jsdelivr.net ${kakao}; connect-src 'self' https://*.supabase.co https://cdn.jsdelivr.net ${kakao}${isDev ? " ws://localhost:* http://localhost:*" : ""}; frame-src ${kakao}; child-src ${kakao}; frame-ancestors 'none';`,
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["pdf-lib", "@pdf-lib/fontkit", "pino", "puppeteer-core", "@sparticuz/chromium"],
  outputFileTracingIncludes: { "/**": ["./public/fonts/**", "./public/brand/**", "./assets/**"] },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
