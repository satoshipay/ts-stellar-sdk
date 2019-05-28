import { xdr } from "ts-stellar-xdr";

import { createAccountId, simplifyAccountId } from "../simpleTypes/accountId";
import { convert } from "../utils/conversion";

export interface SimpleAccountMergeOp {
  type: "accountMerge";
  sourceAccount?: string;
  destinationAccount: string;
}

export function createAccountMergeOp(simpleOperation: SimpleAccountMergeOp): xdr.AccountId {
  return convert(simpleOperation, createAccountId, "destinationAccount");
}

export function simplifyAccountMergeOp(operation: xdr.AccountId, sourceAccount?: string): SimpleAccountMergeOp {
  return {
    type: "accountMerge",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    destinationAccount: simplifyAccountId(operation)
  };
}
