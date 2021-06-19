import { xdr } from "ts-stellar-xdr";

import * as muxedAccount from "../simpleTypes/muxedAccount";
import { hexToBinary, binaryToHex } from "../utils/hex";

export interface SimpleClaimClaimableBalanceOp {
  type: "claimClaimableBalance";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  balanceId: string;
}

export function create(simpleOperation: SimpleClaimClaimableBalanceOp): xdr.ClaimClaimableBalanceOp {
  const binaryValue = hexToBinary(simpleOperation.balanceId);
  if (binaryValue.byteLength !== 32) {
    throw new Error(`Length of hash value must be 32 (is ${binaryValue.byteLength})`);
  }

  return {
    balanceId: { type: "claimableBalanceIdTypeV0", value: binaryValue }
  };
}

export function simplify(
  operation: xdr.ClaimClaimableBalanceOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleClaimClaimableBalanceOp {
  return {
    type: "claimClaimableBalance",
    sourceAccount,
    balanceId: binaryToHex(operation.balanceId.value)
  };
}
