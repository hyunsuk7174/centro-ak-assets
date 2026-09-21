import { requireUser, isSuper } from "@/lib/auth";
import { listVehicles } from "@/server/fulfillment/repo";
import { StockTable } from "./StockTable";

export default async function StockPage() {
  const user = await requireUser("SUPER_ADMIN", "HQ_STAFF");
  const rows = await listVehicles();
  return (
    <div>
      <h1>차량 재고</h1>
      <p className="mt-1 text-sm text-muted">수입된 차량의 차대번호를 등록하고, 계약 상세 화면에서 계약에 배정합니다. 통관필증은 차대번호별로 올려두면 등록서류 묶음에 자동으로 들어갑니다.</p>
      <div className="mt-6"><StockTable rows={rows} isSuper={isSuper(user)} /></div>
    </div>
  );
}
