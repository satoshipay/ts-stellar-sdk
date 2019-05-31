import { HalLinks } from "./general";

export interface MetricsResponse {
  _links: HalLinks<"self">;
  goroutines: SingleMetric;
  "history.elder_ledger": SingleMetric;
  "history.latest_ledger": SingleMetric;
  "history.open_connections": SingleMetric;
  "ingester.ingest_ledger": LogTotalMetric;
  "ingester.clear_ledger": LogTotalMetric;
  "logging.debug": LogMetric;
  "logging.error": LogMetric;
  "logging.info": LogMetric;
  "logging.panic": LogMetric;
  "logging.warning": LogMetric;
  "requests.failed": LogMetric;
  "requests.succeeded": LogMetric;
  "requests.total": LogTotalMetric;
  "stellar_core.latest_ledger": SingleMetric;
  "stellar_core.open_connections": SingleMetric;
  "txsub.buffered": SingleMetric;
  "txsub.failed": LogMetric;
  "txsub.open": SingleMetric;
  "txsub.succeeded": LogMetric;
  "txsub.total": LogTotalMetric;
}

export interface SingleMetric {
  value: number;
}

export interface LogMetric {
  "15m.rate": number;
  "1m.rate": number;
  "5m.rate": number;
  count: number;
  "mean.rate": number;
}

export interface LogTotalMetric extends LogMetric {
  "75%": number;
  "95%": number;
  "99%": number;
  "99.9%": number;
  max: number;
  mean: number;
  median: number;
  min: number;
  stddev: number;
}
