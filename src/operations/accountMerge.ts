import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import { convert } from "../utils/conversion";

export interface SimpleAccountMergeOp {
  type: "accountMerge";
  sourceAccount?: string;
  destinationAccount: string;
}

export function create(simpleOperation: SimpleAccountMergeOp): xdr.AccountId {
  return convert(simpleOperation, accountId.create, "destinationAccount");
}

export function simplify(operation: xdr.AccountId, sourceAccount?: string): SimpleAccountMergeOp {
  return {
    type: "accountMerge",
    sourceAccount,
    destinationAccount: accountId.simplify(operation)
  };
}
