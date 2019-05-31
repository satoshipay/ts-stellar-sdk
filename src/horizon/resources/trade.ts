import { HalLinks, PriceResponse } from "./general";

export interface TradeResponse {
  _links: HalLinks<"self" | "base" | "counter" | "operation">;

  id: string;
  paging_token: string;
  ledger_close_time: string;
  offer_id: string;
  base_offer_id: string;
  base_account: string;
  base_amount: string;
  base_asset_type: string;
  base_asset_code?: string;
  base_asset_issuer?: string;
  counter_offer_id: string;
  counter_account: string;
  counter_amount: string;
  counter_asset_type: string;
  counter_asset_code?: string;
  counter_asset_issuer?: string;
  base_is_seller: boolean;
  price: PriceResponse;
}
