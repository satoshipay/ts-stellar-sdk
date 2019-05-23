import { Asset, AllowTrustOpAsset } from "ts-stellar-xdr";

import { createAccountId } from "./accountId";

export type SimpleAsset = "native" | { assetCode: string; issuer: string };

export function createAsset(simpleAsset: SimpleAsset): Asset {
  if (simpleAsset === "native") {
    return { type: "assetTypeNative" };
  }

  const allowTrustOpAsset = createAllowTrustOpAsset(simpleAsset.assetCode);
  const value = {
    assetCode: allowTrustOpAsset.value,
    issuer: createAccountId(simpleAsset.issuer)
  };

  return allowTrustOpAsset.type === "assetTypeCreditAlphanum4"
    ? { type: "assetTypeCreditAlphanum4", value }
    : { type: "assetTypeCreditAlphanum12", value };
}

export function createAllowTrustOpAsset(assetCode: string): AllowTrustOpAsset {
  if (!/^[a-zA-Z0-9]{1,12}$/.test(assetCode)) {
    throw new Error("Asset code is invalid (maximum alphanumeric, 12 characters at max)");
  }

  const length = assetCode.length;
  const assetCodeArray = new Uint8Array(length <= 4 ? 4 : 12);
  assetCodeArray.set(assetCode.split("").map(s => s.charCodeAt(0)));

  return length <= 4
    ? { type: "assetTypeCreditAlphanum4", value: assetCodeArray.buffer }
    : { type: "assetTypeCreditAlphanum12", value: assetCodeArray.buffer };
}
