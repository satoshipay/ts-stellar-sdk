import { PublicKey } from "ts-stellar-xdr";

import { base32ToBinary } from "../utils/base32";

export function createAccountId(simplePublicKey: string): PublicKey {
  return {
    type: "publicKeyTypeEd25519",
    value: base32ToBinary("ed25519PublicKey", simplePublicKey)
  };
}
