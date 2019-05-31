import { AssetResponse } from "./asset";
import { PriceResponse } from "./general";

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
