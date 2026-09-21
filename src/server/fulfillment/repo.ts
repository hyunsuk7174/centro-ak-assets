import "server-only";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { ModelCode as MC } from "./constants";

export type ModelCode = MC;
export interface Vehicle { id: string; vin: string; model_code: ModelCode; edition: string | null; color: string | null; model_year: number | null; mfg_date: string | null; import_date: string | null; status: "STOCK" | "ASSIGNED" | "DELIVERED"; contract_id: string | null; customs_doc_path: string | null; notes: string | null; created_at: string }
export interface Payment { id: string; contract_id: string; kind: "DEPOSIT" | "BALANCE" | "FINANCE" | "OTHER"; amount: number; paid_at: string; payer_name: string | null; memo: string | null; created_at: string }
export interface Attachment { id: string; contract_id: string; doc_type: "TAX_INVOICE" | "ID_CARD" | "BUYER_BIZ_CERT" | "OTHER"; label: string | null; file_path: string; mime: string | null; created_at: string }
export interface ModelDoc { id: string; scope: "MODEL" | "COMPANY"; model_code: string | null; doc_type: string; file_path: string; mime: string | null; uploaded_at: string }
export interface Bundle { id: string; contract_id: string; file_path: string; doc_list: unknown; generated_at: string }

export { MODEL_INFO, MODEL_DOC_TYPES, COMPANY_DOC_TYPES, ATTACHMENT_TYPES } from "./constants";

const admin = () => supabaseAdmin();

export async function listVehicles(status?: Vehicle["status"]) {
  let q = admin().from("vehicles").select("*, contract:contracts(contract_no)").order("created_at", { ascending: false });
  if (status) q = q.eq("status", status);
  const { data, error } = await q; if (error) throw new Error(error.message);
  return (data ?? []) as (Vehicle & { contract: { contract_no: string } | null })[];
}
export async function getVehicleForContract(contractId: string) {
  const { data } = await admin().from("vehicles").select("*").eq("contract_id", contractId).maybeSingle();
  return (data ?? null) as Vehicle | null;
}
export async function listPayments(contractId: string) {
  const { data } = await admin().from("payments").select("*").eq("contract_id", contractId).order("paid_at");
  return (data ?? []) as Payment[];
}
export async function listAttachments(contractId: string) {
  const { data } = await admin().from("contract_attachments").select("*").eq("contract_id", contractId).order("created_at");
  return (data ?? []) as Attachment[];
}
export async function listModelDocs() {
  const { data } = await admin().from("model_docs").select("*");
  return (data ?? []) as ModelDoc[];
}
export async function listBundles(contractId: string) {
  const { data } = await admin().from("registration_bundles").select("*").eq("contract_id", contractId).order("generated_at", { ascending: false });
  return (data ?? []) as Bundle[];
}
export async function getAgent() {
  const { data } = await admin().from("app_settings").select("key, value").in("key", ["REG_AGENT_NAME", "REG_AGENT_RRN", "REG_AGENT_ADDRESS"]);
  const m = Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<string, string>;
  return { name: m.REG_AGENT_NAME ?? "", rrn: m.REG_AGENT_RRN ?? "", address: m.REG_AGENT_ADDRESS ?? "" };
}
