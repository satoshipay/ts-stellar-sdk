import { HalLinks } from "./general";

export interface RootResponse {
  _links: HalLinks<
    "account" | "account_transactions" | "assets" | "metrics" | "order_book" | "self" | "transaction" | "transactions",
    "friendbot"
  >;
  horizon_version: string;
  core_version: string;
  history_latest_ledger: number;
  history_elder_ledger: number;
  core_latest_ledger: number;
  network_passphrase: string;
  current_protocol_version: number;
  core_supported_protocol_version: number;
}
