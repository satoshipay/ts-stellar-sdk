import { HalLinks, PriceResponse } from "./general";
import { AssetResponse } from "./asset";

export interface OperationIndexOptions {
  by?: { idType: "account" | "ledger" | "transaction"; id: string };
  includeFailed?: boolean;
}

function createOptionsProcessor(type: "operations" | "payments") {
  return (options?: OperationIndexOptions) => {
    let path: string[] = [type];

    const by = options && options.by;
    if (by) {
      path = [`${by.idType}s`, by.id, type];
    }

    let query;
    if (options) {
      query = { include_failed: options.includeFailed };
    }

    return { path, query };
  };
}

export const operationIndexProcessor = {
  options: createOptionsProcessor("operations"),
  response: (response: OperationResponse) => response
};

export const paymentsIndexProcessor = {
  options: createOptionsProcessor("operations"),
  response: (response: PaymentOperationResponse) => response
};

export interface OperationShowOptions {
  id: string;
}

export const operationShowProcessor = {
  options: (options: OperationShowOptions) => {
    return { path: ["operations", options.id] };
  },
  response: (response: OperationResponse) => response
};

export type BaseOperationResponse = {
  _links: HalLinks<"self" | "transaction" | "effects" | "succeeds" | "precedes">;
  id: string;
  paging_token: string;
  transaction_successful: boolean;
  source_account: string;
  created_at: string;
  transaction_hash: string;
};

export interface OperationOfferResponse {
  amount: string;
  price: string;
  price_r: PriceResponse;
  buying_asset_type: string;
  buying_asset_code?: string;
  buying_asset_issuer?: string;
  selling_asset_type: string;
  selling_asset_code?: string;
  selling_asset_issuer?: string;
}

export type OperationResponse =
  | CreateAccountOperationResponse
  | PaymentOperationResponse
  | PathPaymentOperationResponse
  | ManageSellOfferOperationResponse
  | CreatePassiveSellOfferOperationResponse
  | SetOptionsOperationResponse
  | ChangeTrustOperationResponse
  | AllowTrustOperationResponse
  | AccountMergeOperationResponse
  | InflationOperationResponse
  | ManageDataOperationResponse
  | BumpSequenceOperationResponse
  | ManageBuyOfferOperationResponse;

export interface CreateAccountOperationResponse extends BaseOperationResponse {
  type: "create_account";
  type_i: 0;
  starting_balance: string;
  funder: string;
  account: string;
}

export interface PaymentOperationResponse extends AssetResponse, BaseOperationResponse {
  type: "payment";
  type_i: 1;
  from: string;
  to: string;
  amount: string;
}

export interface PathPaymentOperationResponse extends BaseOperationResponse {
  type: "path_payment";
  type_i: 2;
  path: AssetResponse[];
  source_amount: string;
  source_max: string;
  source_asset_type: string;
  source_asset_code?: string;
  source_asset_issuer?: string;
}

export interface ManageSellOfferOperationResponse extends OperationOfferResponse, BaseOperationResponse {
  type: "manage_offer";
  type_i: 3;
  offer_id: number;
}

export interface CreatePassiveSellOfferOperationResponse extends OperationOfferResponse, BaseOperationResponse {
  type: "create_passive_offer";
  type_i: 4;
}

export interface SetOptionsOperationResponse extends BaseOperationResponse {
  type: "set_options";
  type_i: 5;
  home_domain?: string;
  inflation_dest?: string;
  master_key_weight?: number;
  signer_key?: string;
  signer_weight?: number;
  set_flags?: number[];
  set_flags_s?: string[];
  clear_flags?: number[];
  clear_flags_s?: string[];
  low_threshold?: number;
  med_threshold?: number;
  high_threshold?: number;
}

export interface ChangeTrustOperationResponse extends AssetResponse, BaseOperationResponse {
  type: "change_trust";
  type_i: 6;
  limit: string;
  trustee: string;
  trustor: string;
}

export interface AllowTrustOperationResponse extends AssetResponse, BaseOperationResponse {
  type: "allow_trust";
  type_i: 7;
  trustee: string;
  trustor: string;
  authorize: boolean;
}

export interface AccountMergeOperationResponse extends BaseOperationResponse {
  type: "account_merge";
  type_i: 8;
  account: string;
  into: string;
}

export interface InflationOperationResponse extends BaseOperationResponse {
  type: "inflation";
  type_i: 9;
}

export interface ManageDataOperationResponse extends BaseOperationResponse {
  type: "manage_data";
  type_i: 10;
  name: string;
  value: string;
}

export interface BumpSequenceOperationResponse extends BaseOperationResponse {
  type: "bump_sequence";
  type_i: 11;
  bump_to: string;
}

export interface ManageBuyOfferOperationResponse extends OperationOfferResponse, BaseOperationResponse {
  type: "manage_buy_offer";
  type_i: 12;
  offer_id: number;
}
