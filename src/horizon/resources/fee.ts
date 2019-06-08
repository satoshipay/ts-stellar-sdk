export const operationFeeStatsProcessor = {
  options: () => {
    return { path: ["fee_stats"] };
  },
  response: (response: FeeResponse) => response
};

export interface FeeResponse {
  min_accepted_fee: string;
  mode_accepted_fee: string;
  p10_accepted_fee: string;
  p20_accepted_fee: string;
  p30_accepted_fee: string;
  p40_accepted_fee: string;
  p50_accepted_fee: string;
  p60_accepted_fee: string;
  p70_accepted_fee: string;
  p80_accepted_fee: string;
  p90_accepted_fee: string;
  p95_accepted_fee: string;
  p99_accepted_fee: string;
  ledger_capacity_usage: string;
  last_ledger_base_fee: string;
  last_ledger: string;
}
