import { AssetResponse } from "./asset";

export interface PaymentPathResponse {
  source_asset_type: string;
  source_asset_code?: string;
  source_asset_issuer?: string;
  source_amount: string;
  destination_asset_type: string;
  destination_asset_code?: string;
  destination_asset_issuer: string;
  destination_amount: string;
  path: AssetResponse[];
}
