import { HalLinks } from "./general";

export interface LedgerResponse {
  _links: HalLinks<"self" | "transactions" | "operations" | "payments" | "effects">;
  id: string;
  paging_token: string;
  hash: string;
  prev_hash?: string;
  sequence: number;
  successful_transaction_count: number;
  failed_transaction_count: number;
  operation_count: number;
  closed_at: string;
  total_coins: string;
  fee_pool: string;
  base_fee_in_stroops: number;
  base_reserve_in_stroops: number;
  max_tx_set_size: number;
  protocol_version: number;
  header_xdr: string;
}
