import { xdr } from "ts-stellar-xdr";

import { createAccountId } from "../simpleTypes/accountId";
import { convert } from "../operation";

export interface SimpleAccountMergeOp {
  type: "accountMerge";
  sourceAccount?: string;
  destinationAccount: string;
}

export function createAccountMergeOp(simpleOperation: SimpleAccountMergeOp): xdr.AccountId {
  return convert(simpleOperation, createAccountId, "destinationAccount");
}
