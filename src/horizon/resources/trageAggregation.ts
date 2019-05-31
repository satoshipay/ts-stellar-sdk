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
