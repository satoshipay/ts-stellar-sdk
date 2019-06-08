import { HalLinks } from "./general";
import { AssetResponse } from "./asset";

export interface AccountShowOptions {
  accountId: string;
}

export const accountShowProcessor = {
  options: ({ accountId }: AccountShowOptions) => {
    return { path: ["accounts", accountId] };
  },
  response: (response: AccountResponse) => response
};

export interface AccountResponse {
  _links: HalLinks<"self" | "transactions" | "operations" | "payments" | "effects" | "offers" | "trades" | "data">;
  id: string;
  paging_token?: string;
  account_id: string;
  sequence: string;
  subentry_count: number;
  inflation_destination?: string;
  home_domain?: string;
  last_modified_ledger: number;
  thresholds: {
    low_threshold: number;
    med_threshold: number;
    high_threshold: number;
  };
  flags: AccountFlagsResponse;
  balances: BalanceResponse[];
  signers: SignerResponse[];
  data: Record<string, string>;
}

export interface SignerResponse {
  weight: number;
  key: string;
  type: "ed25519_public_key" | "sha256_hash" | "preauth_tx";
}

export interface BalanceResponse extends AssetResponse {
  balance: string;
  limit?: number;
  buying_liabilities: string;
  selling_liabilities: string;
  last_modified_ledger?: number;
  is_authorized?: boolean;
}

export interface AccountFlagsResponse {
  auth_required: boolean;
  auth_revocable: boolean;
  auth_immutable: boolean;
}
