import { xdr } from "ts-stellar-xdr";

import { createAccountId, simplifyAccountId } from "../simpleTypes/accountId";
import { convert } from "../operation";
import { SimpleInt64, createPositiveInt64, simplifyInt64 } from "../simpleTypes/int64";

export interface SimpleCreateAccountOp {
  type: "createAccount";
  sourceAccount?: string;
  destination: string;
  startingBalanceStroops: SimpleInt64;
}

export function createCreateAccountOp(simpleOperation: SimpleCreateAccountOp): xdr.CreateAccountOp {
  return {
    destination: convert(simpleOperation, createAccountId, "destination"),
    startingBalance: convert(simpleOperation, createPositiveInt64, "startingBalanceStroops")
  };
}

export function simplifyCreateAccountOp(operation: xdr.CreateAccountOp, sourceAccount?: string): SimpleCreateAccountOp {
  return {
    type: "createAccount",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    destination: simplifyAccountId(operation.destination),
    startingBalanceStroops: simplifyInt64(operation.startingBalance)
  };
}
