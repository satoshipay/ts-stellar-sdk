import { xdr } from "ts-stellar-xdr";

import { base32ToBinary, binaryToBase32 } from "../utils/base32";
import { hexToBinary, binaryToHex } from "../utils/hex";

export type SimpleSignerKey =
  | {
      type: "ed25519";
      value: string;
    }
  | {
      type: "preAuthTx";
      value: string;
    }
  | {
      type: "hashX";
      value: string;
    };

export function create(signerKey: SimpleSignerKey): xdr.SignerKey {
  let key: xdr.SignerKey;

  switch (signerKey.type) {
    case "ed25519":
      key = {
        type: "signerKeyTypeEd25519",
        value: base32ToBinary("ed25519PublicKey", signerKey.value)
      };
      break;
    case "preAuthTx":
      key = {
        type: "signerKeyTypePreAuthTx",
        value: hexToBinary(signerKey.value)
      };
      break;
    case "hashX":
      key = {
        type: "signerKeyTypeHashX",
        value: hexToBinary(signerKey.value)
      };
      break;
    default:
      throw new Error("Invalid signer type");
  }

  if (key.value.byteLength !== 32) {
    throw new Error(`invalid signer key length (expected: 32; got: ${key.value.byteLength})`);
  }

  return key;
}

export function simplify(signerKey: xdr.SignerKey): SimpleSignerKey {
  switch (signerKey.type) {
    case "signerKeyTypeEd25519":
      return {
        type: "ed25519",
        value: binaryToBase32("ed25519PublicKey", signerKey.value)
      };
    case "signerKeyTypePreAuthTx":
      return {
        type: "preAuthTx",
        value: binaryToHex(signerKey.value)
      };
    case "signerKeyTypeHashX":
      return {
        type: "hashX",
        value: binaryToHex(signerKey.value)
      };
  }
}
