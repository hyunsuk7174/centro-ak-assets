import { requireUser, isSuper } from "@/lib/auth";
import { listModelDocs, getAgent } from "@/server/fulfillment/repo";
import { RegistrationSettings } from "./RegistrationSettings";

export default async function RegistrationPage() {
  const user = await requireUser("SUPER_ADMIN", "HQ_STAFF");
  const [docs, agent] = await Promise.all([listModelDocs(), getAgent()]);
  return (
    <div>
      <h1>등록서류 설정</h1>
      <p className="mt-1 text-sm text-muted">등록대행에 제출하는 서류 중 공통으로 쓰는 것을 여기서 관리합니다. 계약별 서류 생성은 각 계약 상세 화면의 "출고·등록"에서 합니다.</p>
      <div className="mt-6"><RegistrationSettings docs={docs} agent={agent} isSuper={isSuper(user)} /></div>
    </div>
  );
}
