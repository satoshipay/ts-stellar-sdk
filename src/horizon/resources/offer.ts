import { HalLinks, PriceResponse } from "./general";
import { AssetResponse } from "./asset";

export interface OffersByAccountOptions {
  accountId: string;
}

export const offersByAccountProcessor = {
  options: (options: OffersByAccountOptions) => {
    return { path: ["accounts", options.accountId, "offers"] };
  },
  response: (response: OfferResponse) => response
};

export interface OfferResponse {
  _links: HalLinks<"self" | "offer_maker">;
  id: number;
  paging_token: string;
  seller: string;
  selling: AssetResponse;
  buying: AssetResponse;
  amount: string;
  price_r: PriceResponse;
  price: string;
  last_modified_ledger: number;
  last_modified_time: string;
}
