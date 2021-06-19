import { xdr } from "ts-stellar-xdr";

import * as muxedAccount from "../simpleTypes/muxedAccount";
import { hexToBinary, binaryToHex } from "../utils/hex";

export interface SimpleClawbackClaimableBalanceOp {
  type: "clawbackClaimableBalance";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  balanceId: string;
}

export function create(simpleOperation: SimpleClawbackClaimableBalanceOp): xdr.ClawbackClaimableBalanceOp {
  const binaryValue = hexToBinary(simpleOperation.balanceId);
  if (binaryValue.byteLength !== 32) {
    throw new Error(`Length of hash value must be 32 (is ${binaryValue.byteLength})`);
  }

  return {
    balanceId: { type: "claimableBalanceIdTypeV0", value: binaryValue }
  };
}

export function simplify(
  operation: xdr.ClawbackClaimableBalanceOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleClawbackClaimableBalanceOp {
  return {
    type: "clawbackClaimableBalance",
    sourceAccount,
    balanceId: binaryToHex(operation.balanceId.value)
  };
}
