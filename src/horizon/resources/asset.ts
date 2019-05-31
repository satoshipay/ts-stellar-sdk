import { HalLinks } from "./general";
import { AccountFlagsResponse } from "./account";

export interface AssetResponse {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
}

export interface AssetStatResponse extends AssetResponse {
  _links: HalLinks<"toml">;
  paging_token: string;
  amount: string;
  num_accounts: number;
  flags: AccountFlagsResponse;
}
