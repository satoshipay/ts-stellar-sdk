import { xdr } from "ts-stellar-xdr";

import { createAccountId } from "../simpleTypes/accountId";
import { convert } from "../operation";
import { SimpleInt64, createPositiveInt64 } from "../simpleTypes/int64";

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
