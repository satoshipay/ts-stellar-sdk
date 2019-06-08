import { AssetResponse } from "./asset";
import { SimpleAsset } from "../../simpleTypes/asset";
import { simpleAssetToAssetQuery } from "./general";

export interface PathIndexOptions {
  destinationAsset: SimpleAsset;
  destinationAccount: string;
  sourceAccount: string;
  destinationAmount: string; // a lumen string; no stroop value
}

export const pathIndexProcessor = {
  options: (options: PathIndexOptions) => {
    const destinationAsset = simpleAssetToAssetQuery(options.destinationAsset);

    const query = {
      destination_asset_type: destinationAsset.assetType,
      destination_asset_code: destinationAsset.assetCode,
      destination_asset_issuer: destinationAsset.assetIssuer,
      destination_amount: options.destinationAmount,
      destination_account: options.destinationAccount,
      source_account: options.sourceAccount
    };
    return { path: ["paths"], query };
  },
  response: (response: PaymentPathResponse) => response
};

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
