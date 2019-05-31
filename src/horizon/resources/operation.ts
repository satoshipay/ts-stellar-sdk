import { HalLinks, PriceResponse } from "./general";
import { AssetResponse } from "./asset";

export type BaseOperationResponse = {
  _links: HalLinks<"self" | "transaction" | "effects" | "succeeds" | "precedes">;
  id: string;
  paging_token: string;
  transaction_successful: boolean;
  source_account: string;
  created_at: string;
  transaction_hash: string;
} & SpecificOperationResponse;

export type OperationResponse = BaseOperationResponse & SpecificOperationResponse;

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

export type SpecificOperationResponse =
  | CreateAccountOpResponse
  | PaymentOpResponse
  | PathPaymentOpResponse
  | ManageSellOfferOpResponse
  | CreatePassiveSellOfferOpResponse
  | SetOptionsOpResponse
  | ChangeTrustOpResponse
  | AllowTrustOpResponse
  | AccountMergeOpResponse
  | InflationOpResponse
  | ManageDataOpResponse
  | BumpSequenceOpResponse
  | ManageBuyOfferOpResponse;

export interface CreateAccountOpResponse {
  type: "create_account";
  type_i: 0;
  starting_balance: string;
  funder: string;
  account: string;
}

export interface PaymentOpResponse extends AssetResponse {
  type: "payment";
  type_i: 1;
  from: string;
  to: string;
  amount: string;
}

export interface PathPaymentOpResponse {
  type: "path_payment";
  type_i: 2;
  path: AssetResponse[];
  source_amount: string;
  source_max: string;
  source_asset_type: string;
  source_asset_code?: string;
  source_asset_issuer?: string;
}

export interface ManageSellOfferOpResponse extends OperationOfferResponse {
  type: "manage_offer";
  type_i: 3;
  offer_id: number;
}

export interface CreatePassiveSellOfferOpResponse extends OperationOfferResponse {
  type: "create_passive_offer";
  type_i: 4;
}

export interface SetOptionsOpResponse {
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

export interface ChangeTrustOpResponse extends AssetResponse {
  type: "change_trust";
  type_i: 6;
  limit: string;
  trustee: string;
  trustor: string;
}

export interface AllowTrustOpResponse extends AssetResponse {
  type: "allow_trust";
  type_i: 7;
  trustee: string;
  trustor: string;
  authorize: boolean;
}

export interface AccountMergeOpResponse {
  type: "account_merge";
  type_i: 8;
  account: string;
  into: string;
}

export interface InflationOpResponse {
  type: "inflation";
  type_i: 9;
}

export interface ManageDataOpResponse {
  type: "manage_data";
  type_i: 10;
  name: string;
  value: string;
}

export interface BumpSequenceOpResponse {
  type: "bump_sequence";
  type_i: 11;
  bump_to: string;
}

export interface ManageBuyOfferOpResponse extends OperationOfferResponse {
  type: "manage_buy_offer";
  type_i: 12;
  offer_id: number;
}
