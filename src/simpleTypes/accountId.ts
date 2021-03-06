import { xdr } from "ts-stellar-xdr";

import { base32ToBinary, binaryToBase32 } from "../utils/base32";

export function create(simpleAccountId: string): xdr.AccountId {
  return {
    type: "publicKeyTypeEd25519",
    value: base32ToBinary("ed25519PublicKey", simpleAccountId)
  };
}

export function simplify(accountId: xdr.AccountId): string {
  return binaryToBase32("ed25519PublicKey", accountId.value);
}
