import { HalLinks } from "./general";
import { AssetResponse } from "./asset";

export interface EffectsIndexOptions {
  by?: { idType: "account" | "ledger" | "transaction" | "operation"; id: string };
}

export const effectIndexProcessor = {
  options: (options?: EffectsIndexOptions) => {
    let path: string[] = ["effects"];

    const by = options && options.by;
    if (by) {
      path = [`${by.idType}s`, by.id, "effects"];
    }

    return { path };
  },
  response: (response: EffectResponse) => response
};

export interface BaseEffectResponse {
  _links: HalLinks<"operation" | "succeeds" | "precedes">;
  id: string;
  paging_token: string;
  account: string;
  created_at: string;
}

export type EffectResponse =
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

export interface AccountCreatedEffectResponse extends BaseEffectResponse {
  type: "account_created";
  type_i: 0;
  starting_balance: string;
}

export interface AccountRemovedEffectResponse extends BaseEffectResponse {
  type: "account_removed";
  type_i: 1;
}

export interface AccountCreditedEffectResponse extends AssetResponse, BaseEffectResponse {
  type: "account_credited";
  type_i: 2;
  amount: string;
}

export interface AccountDebitedEffectResponse extends AssetResponse, BaseEffectResponse {
  type: "account_debited";
  type_i: 3;
  amount: string;
}

export interface AccountThresholdUpatedEffectResponse extends BaseEffectResponse {
  type: "account_thresholds_updated";
  type_i: 4;
  low_threshold: number;
  med_threshold: number;
  high_threshold: number;
}

export interface AccountHomeDomainUpdatedEffectResponse extends BaseEffectResponse {
  type: "account_home_domain_updated";
  type_i: 5;
  home_domain: string;
}

export interface AccountFlagsUpdatedEffectResponse extends BaseEffectResponse {
  type: "account_flags_updated";
  type_i: 6;
  auth_required_flag?: boolean;
  auth_revokable_flag?: boolean;
}

export interface AccountInflationDestinationUpdatedEffectResponse extends BaseEffectResponse {
  type: "account_inflation_destination_updated";
  type_i: 7;
}

export interface SignerCreatedEffectResponse extends BaseEffectResponse {
  type: "signer_created";
  type_i: 10;
  weight: number;
  public_key: string;
  key: string;
}

export interface SignerRemovedEffectResponse extends BaseEffectResponse {
  type: "signer_removed";
  type_i: 11;
  weight: number;
  public_key: string;
  key: string;
}

export interface SignerUpdatedEffectResponse extends BaseEffectResponse {
  type: "signer_updated";
  type_i: 12;
  weight: number;
  public_key: string;
  key: string;
}

export interface TrustlineCreatedEffectResponse extends AssetResponse, BaseEffectResponse {
  type: "trustline_created";
  type_i: 20;
  limit: string;
}

export interface TrustlineRemovedEffectResponse extends AssetResponse, BaseEffectResponse {
  type: "trustline_removed";
  type_i: 21;
  limit: string;
}

export interface TrustlineUpdatedEffectResponse extends AssetResponse, BaseEffectResponse {
  type: "trustline_updated";
  type_i: 22;
  limit: string;
}

export interface TrustlineAuthorizedEffectResponse extends BaseEffectResponse {
  type: "trustline_authorized";
  type_i: 23;
  trustor: string;
  asset_type: string;
  asset_code?: string;
}

export interface TrustlineDeauthorizedEffectResponse extends BaseEffectResponse {
  type: "trustline_deauthorized";
  type_i: 24;
  trustor: string;
  asset_type: string;
  asset_code?: string;
}

export interface OfferCreatedEffectResponse extends BaseEffectResponse {
  type: "offer_created";
  type_i: 30;
}

export interface OfferRemovedEffectResponse extends BaseEffectResponse {
  type: "offer_removed";
  type_i: 31;
}

export interface OfferUpdatedEffectResponse extends BaseEffectResponse {
  type: "offer_updated";
  type_i: 32;
}

export interface TradeEffectResponse extends BaseEffectResponse {
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

export interface DataCreatedEffectResponse extends BaseEffectResponse {
  type: "data_created";
  type_i: 40;
}

export interface DataRemovedEffectResponse extends BaseEffectResponse {
  type: "data_removed";
  type_i: 41;
}

export interface DataUpdatedEffectResponse extends BaseEffectResponse {
  type: "data_updated";
  type_i: 42;
}

export interface SequenceBumpedEffectResponse extends BaseEffectResponse {
  type: "sequence_bumped";
  type_i: 43;
  new_seq: number;
}
