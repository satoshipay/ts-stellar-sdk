import { SimpleAsset } from "../../simpleTypes/asset";
import { simpleAssetToAssetQuery } from "./general";

export type Resolution = "1min" | "5min" | "15min" | "1h" | "1d" | "1w";

export interface TradeAggregateIndexOptions {
  baseAsset: SimpleAsset;
  counterAsset: SimpleAsset;
  resolution: Resolution;
  offset?: number;
  startTime?: number;
  endTime?: number;
}

function resolutionStringToNumber(resolution: Resolution) {
  switch (resolution) {
    case "1min":
      return "60000";
    case "5min":
      return "300000";
    case "15min":
      return "900000";
    case "1h":
      return "3600000";
    case "1d":
      return "86400000";
    case "1w":
      return "604800000";
  }
}

export const tradeAggregateIndexProcessor = {
  options: (options: TradeAggregateIndexOptions) => {
    const baseAsset = simpleAssetToAssetQuery(options.baseAsset);
    const counterAsset = simpleAssetToAssetQuery(options.counterAsset);

    const query = {
      base_asset_type: baseAsset.assetType,
      base_asset_code: baseAsset.assetCode,
      base_asset_issuer: baseAsset.assetIssuer,
      counter_asset_type: counterAsset.assetType,
      counter_asset_code: counterAsset.assetCode,
      counter_asset_issuer: counterAsset.assetIssuer,
      resolution: resolutionStringToNumber(options.resolution),
      offset: options.offset,
      start_time: options.startTime,
      end_time: options.endTime
    };
    return { path: ["trade_aggregations"], query };
  },
  response: (response: TradeAggregationsResponse) => response
};

export interface XdrPriceResponse {
  N: number;
  D: number;
}

export interface TradeAggregationsResponse {
  timestamp: number;
  trade_count: number;
  base_volume: string;
  counter_volume: string;
  avg: string;
  high: string;
  high_r: XdrPriceResponse;
  low: string;
  low_r: XdrPriceResponse;
  open: string;
  open_r: XdrPriceResponse;
  close: string;
  close_r: XdrPriceResponse;
}
