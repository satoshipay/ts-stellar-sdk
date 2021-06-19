import { xdr } from "ts-stellar-xdr";

import * as weight from "./weight";
import * as signerKey from "./signerKey";

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

export function create(simpleSigner: SimpleSigner): xdr.Signer {
  const key = signerKey.create(simpleSigner);

  let signerWeight;
  try {
    signerWeight = weight.validate(simpleSigner.weight);
  } catch (error) {
    throw new Error(`invalid signer weight: ${error.message}`);
  }

  return {
    key,
    weight: signerWeight
  };
}

export function simplify(signer: xdr.Signer): SimpleSigner {
  const key = signerKey.simplify(signer.key);
  return { ...key, weight: signer.weight };
}
