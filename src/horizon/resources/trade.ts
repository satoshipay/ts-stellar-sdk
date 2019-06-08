import { HalLinks, PriceResponse, simpleAssetToAssetQuery } from "./general";

import { SimpleAsset } from "../../simpleTypes/asset";

export interface TradeIndexOptions {
  by?: { idType: "account" | "offer"; id: string };
  assetPair?: {
    base: SimpleAsset;
    counter: SimpleAsset;
  };
}

export const tradeIndexProcessor = {
  options: (options?: TradeIndexOptions) => {
    let path: string[] = ["trades"];

    const by = options && options.by;
    if (by) {
      path = [`${by.idType}s`, by.id, "trades"];
    }

    let query;
    const assetPair = options && options.assetPair;
    if (assetPair) {
      const baseAsset = simpleAssetToAssetQuery(assetPair.base);
      const counterAsset = simpleAssetToAssetQuery(assetPair.counter);
      query = {
        base_asset_type: baseAsset.assetType,
        base_asset_code: baseAsset.assetCode,
        base_asset_issuer: baseAsset.assetIssuer,
        counter_asset_type: counterAsset.assetType,
        counter_asset_code: counterAsset.assetCode,
        counter_asset_issuer: counterAsset.assetIssuer
      };
    }

    return { path, query };
  },
  response: (response: TradeResponse) => response
};

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
