import { xdr } from "ts-stellar-xdr";

import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleAccountMergeOp {
  type: "accountMerge";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  destinationAccount: muxedAccount.SimpleMuxedAccount;
}

export function create(simpleOperation: SimpleAccountMergeOp): xdr.MuxedAccount {
  return convert(simpleOperation, muxedAccount.create, "destinationAccount");
}

export function simplify(
  operation: xdr.MuxedAccount,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleAccountMergeOp {
  return {
    type: "accountMerge",
    sourceAccount,
    destinationAccount: muxedAccount.simplify(operation)
  };
}
