import { HalLinks } from "./general";
import { AccountFlagsResponse } from "./account";

export interface AssetsOptions {
  assetIssuer?: string;
  assetCode?: string;
}

export const assetProcessor = {
  options: (options?: AssetsOptions) => {
    let query;
    if (options) {
      query = {
        asset_issuer: options.assetIssuer,
        asset_code: options.assetCode
      };
    }

    return { path: ["assets"], query };
  },
  response: (response: AssetStatResponse) => response
};

export interface AssetResponse {
  asset_type: "native" | "credit_alphanum4" | "credit_alphanum12";
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
