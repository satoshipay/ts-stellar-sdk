import { xdr } from "ts-stellar-xdr";

import * as accountId from "./accountId";
import * as assetCode from "./assetCode";

export type SimpleAsset = "native" | { assetCode: string; issuer: string };

export function create(simpleAsset: SimpleAsset): xdr.Asset {
  if (simpleAsset === "native") {
    return { type: "assetTypeNative" };
  }

  const asset = assetCode.create(simpleAsset.assetCode);
  const value = {
    assetCode: asset.value,
    issuer: accountId.create(simpleAsset.issuer)
  };

  return asset.type === "assetTypeCreditAlphanum4"
    ? { type: "assetTypeCreditAlphanum4", value }
    : { type: "assetTypeCreditAlphanum12", value };
}

export function simplify(asset: xdr.Asset): SimpleAsset {
  switch (asset.type) {
    case "assetTypeNative":
      return "native";
    case "assetTypeCreditAlphanum4":
    case "assetTypeCreditAlphanum12":
      return {
        assetCode: assetCode.simplify({ value: asset.value.assetCode }),
        issuer: accountId.simplify(asset.value.issuer)
      };
  }
}
