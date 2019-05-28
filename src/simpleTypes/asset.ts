import { xdr } from "ts-stellar-xdr";

import { createAccountId, simplifyAccountId } from "./accountId";

export type SimpleAsset = "native" | { assetCode: string; issuer: string };

export function createAsset(simpleAsset: SimpleAsset): xdr.Asset {
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

export function createAllowTrustOpAsset(assetCode: string): xdr.AllowTrustOpAsset {
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

export function simplifyAsset(asset: xdr.Asset): SimpleAsset {
  switch (asset.type) {
    case "assetTypeNative":
      return "native";
    case "assetTypeCreditAlphanum4":
    case "assetTypeCreditAlphanum12":
      return {
        assetCode: simplifyAllowTrustOpAsset({ value: asset.value.assetCode }),
        issuer: simplifyAccountId(asset.value.issuer)
      };
  }
}

export function simplifyAllowTrustOpAsset(allowTrustOpAsset: { value: ArrayBuffer }): string {
  const uint8Array = new Uint8Array(allowTrustOpAsset.value);
  const length = uint8Array.length;

  let result = "";
  for (let i = 0; i < length; i++) {
    const charCode = uint8Array[i];
    if (charCode === 0) {
      break;
    }
    result += String.fromCharCode(charCode);
  }

  return result;
}
