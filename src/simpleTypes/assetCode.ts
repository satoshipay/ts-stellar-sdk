import { xdr } from "ts-stellar-xdr";

export function create(assetCode: string): xdr.AssetCode {
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

export function simplify(allowTrustOpAsset: { value: ArrayBuffer }): string {
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
