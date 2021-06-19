import { int64, xdr } from "ts-stellar-xdr";

import { base32ToBinary, binaryToBase32 } from "../utils/base32";

export type SimpleMuxedAccount = string | { accountId: string; subAccountId: string };

export function create(muxedAccount: SimpleMuxedAccount): xdr.MuxedAccount {
  if (typeof muxedAccount === "string") {
    return {
      type: "keyTypeEd25519",
      value: base32ToBinary("ed25519PublicKey", muxedAccount)
    };
  } else {
    return {
      type: "keyTypeMuxedEd25519",
      value: {
        id: int64.Unsigned.fromString(muxedAccount.subAccountId),
        ed25519: base32ToBinary("ed25519PublicKey", muxedAccount.accountId)
      }
    };
  }
}

export function simplify(muxedAccount: xdr.MuxedAccount): SimpleMuxedAccount {
  switch (muxedAccount.type) {
    case "keyTypeEd25519":
      return binaryToBase32("ed25519PublicKey", muxedAccount.value);
    case "keyTypeMuxedEd25519":
      return {
        subAccountId: muxedAccount.value.id.toString(),
        accountId: binaryToBase32("ed25519PublicKey", muxedAccount.value.ed25519)
      };
  }
}
