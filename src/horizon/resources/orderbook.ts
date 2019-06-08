import { AssetResponse } from "./asset";
import { PriceResponse, simpleAssetToAssetQuery } from "./general";
import { SimpleAsset } from "../../simpleTypes/asset";

export interface OrderBookShowOptions {
  sellingAsset: SimpleAsset;
  buyingAsset: SimpleAsset;
  limit?: number;
}

export const orderBookShowProcessor = {
  options: (options: OrderBookShowOptions) => {
    const sellingAsset = simpleAssetToAssetQuery(options.sellingAsset);
    const buyingAsset = simpleAssetToAssetQuery(options.buyingAsset);

    const query = {
      selling_asset_type: sellingAsset.assetType,
      selling_asset_code: sellingAsset.assetCode,
      selling_asset_issuer: sellingAsset.assetIssuer,
      buying_asset_type: buyingAsset.assetType,
      buying_asset_code: buyingAsset.assetCode,
      buying_asset_issuer: buyingAsset.assetIssuer,
      limit: options.limit
    };
    return { path: ["order_book"], query };
  },
  response: (response: OrderBookResponse) => response
};

export interface PriceLevelResponse {
  price_r: PriceResponse;
  price: string;
  amount: string;
}

export interface OrderBookResponse {
  bids: PriceLevelResponse[];
  asks: PriceLevelResponse[];
  base: AssetResponse;
  counter: AssetResponse;
}
