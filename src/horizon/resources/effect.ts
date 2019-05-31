import { HalLinks } from "./general";
import { AssetResponse } from "./asset";

export interface BaseEffectResponse {
  _links: HalLinks<"operation" | "succeeds" | "precedes">;
  id: string;
  paging_token: string;
  account: string;
  created_at: string;
}

export type EffectResponse = BaseEffectResponse & SpecificEffectResponse;

export type SpecificEffectResponse =
  | AccountCreatedEffectResponse
  | AccountRemovedEffectResponse
  | AccountCreditedEffectResponse
  | AccountDebitedEffectResponse
  | AccountThresholdUpatedEffectResponse
  | AccountHomeDomainUpdatedEffectResponse
  | AccountFlagsUpdatedEffectResponse
  | AccountInflationDestinationUpdatedEffectResponse
  | SignerCreatedEffectResponse
  | SignerRemovedEffectResponse
  | SignerUpdatedEffectResponse
  | TrustlineCreatedEffectResponse
  | TrustlineRemovedEffectResponse
  | TrustlineUpdatedEffectResponse
  | TrustlineAuthorizedEffectResponse
  | TrustlineDeauthorizedEffectResponse
  | OfferCreatedEffectResponse
  | OfferRemovedEffectResponse
  | OfferUpdatedEffectResponse
  | TradeEffectResponse
  | DataCreatedEffectResponse
  | DataRemovedEffectResponse
  | DataUpdatedEffectResponse
  | SequenceBumpedEffectResponse;

export interface AccountCreatedEffectResponse {
  type: "account_created";
  type_i: 0;
  starting_balance: string;
}

export interface AccountRemovedEffectResponse {
  type: "account_removed";
  type_i: 1;
}

export interface AccountCreditedEffectResponse extends AssetResponse {
  type: "account_credited";
  type_i: 2;
  amount: string;
}

export interface AccountDebitedEffectResponse extends AssetResponse {
  type: "account_debited";
  type_i: 3;
  amount: string;
}

export interface AccountThresholdUpatedEffectResponse {
  type: "account_thresholds_updated";
  type_i: 4;
  low_threshold: number;
  med_threshold: number;
  high_threshold: number;
}

export interface AccountHomeDomainUpdatedEffectResponse {
  type: "account_home_domain_updated";
  type_i: 5;
  home_domain: string;
}

export interface AccountFlagsUpdatedEffectResponse {
  type: "account_flags_updated";
  type_i: 6;
  auth_required_flag?: boolean;
  auth_revokable_flag?: boolean;
}

export interface AccountInflationDestinationUpdatedEffectResponse {
  type: "account_inflation_destination_updated";
  type_i: 7;
}

export interface SignerCreatedEffectResponse {
  type: "signer_created";
  type_i: 10;
  weight: number;
  public_key: string;
  key: string;
}

export interface SignerRemovedEffectResponse {
  type: "signer_removed";
  type_i: 11;
  weight: number;
  public_key: string;
  key: string;
}

export interface SignerUpdatedEffectResponse {
  type: "signer_updated";
  type_i: 12;
  weight: number;
  public_key: string;
  key: string;
}

export interface TrustlineCreatedEffectResponse extends AssetResponse {
  type: "trustline_created";
  type_i: 20;
  limit: string;
}

export interface TrustlineRemovedEffectResponse extends AssetResponse {
  type: "trustline_removed";
  type_i: 21;
  limit: string;
}

export interface TrustlineUpdatedEffectResponse extends AssetResponse {
  type: "trustline_updated";
  type_i: 22;
  limit: string;
}

export interface TrustlineAuthorizedEffectResponse {
  type: "trustline_authorized";
  type_i: 23;
  trustor: string;
  asset_type: string;
  asset_code?: string;
}

export interface TrustlineDeauthorizedEffectResponse {
  type: "trustline_deauthorized";
  type_i: 24;
  trustor: string;
  asset_type: string;
  asset_code?: string;
}

export interface OfferCreatedEffectResponse {
  type: "offer_created";
  type_i: 30;
}

export interface OfferRemovedEffectResponse {
  type: "offer_removed";
  type_i: 31;
}

export interface OfferUpdatedEffectResponse {
  type: "offer_updated";
  type_i: 32;
}

export interface TradeEffectResponse {
  type: "trade";
  type_i: 33;
  seller: string;
  offer_id: number;
  sold_amount: string;
  sold_asset_type: string;
  sold_asset_code?: string;
  sold_asset_issuer?: string;
  bought_amount: string;
  bought_asset_type: string;
  bought_asset_code?: string;
  bought_asset_issuer?: string;
}

export interface DataCreatedEffectResponse {
  type: "data_created";
  type_i: 40;
}

export interface DataRemovedEffectResponse {
  type: "data_removed";
  type_i: 41;
}

export interface DataUpdatedEffectResponse {
  type: "data_updated";
  type_i: 42;
}

export interface SequenceBumpedEffectResponse {
  type: "sequence_bumped";
  type_i: 43;
  new_seq: number;
}
