import { xdr } from "ts-stellar-xdr";
import { base32ToBinary } from "../utils/base32";
import { hexToBinary } from "../utils/hex";
import { createWeight } from "./weight";

export type SimpleSigner =
  | {
      type: "ed25519";
      value: string;
      weight: number;
    }
  | {
      type: "preAuthTx";
      value: string;
      weight: number;
    }
  | {
      type: "hashX";
      value: string;
      weight: number;
    };

export function createSigner(simpleSigner: SimpleSigner): xdr.Signer {
  let key: xdr.SignerKey;

  switch (simpleSigner.type) {
    case "ed25519":
      key = {
        type: "signerKeyTypeEd25519",
        value: base32ToBinary("ed25519PublicKey", simpleSigner.value)
      };
      break;
    case "preAuthTx":
      key = {
        type: "signerKeyTypePreAuthTx",
        value: hexToBinary(simpleSigner.value)
      };
      break;
    case "hashX":
      key = {
        type: "signerKeyTypeHashX",
        value: hexToBinary(simpleSigner.value)
      };
      break;
    default:
      throw new Error("Invalid signer type");
  }

  if (key.value.byteLength !== 32) {
    throw new Error(`invalid signer key length (expected: 32; got: ${key.value.byteLength})`);
  }

  let weight;
  try {
    weight = createWeight(simpleSigner.weight);
  } catch (error) {
    throw new Error(`invalid signer weight: ${error.message}`);
  }

  return {
    key,
    weight
  };
}
