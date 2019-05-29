import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import * as int64 from "../simpleTypes/int64";
import { convert } from "../utils/conversion";

export interface SimpleCreateAccountOp {
  type: "createAccount";
  sourceAccount?: string;
  destination: string;
  startingBalanceStroops: int64.SimpleInt64;
}

export function create(simpleOperation: SimpleCreateAccountOp): xdr.CreateAccountOp {
  return {
    destination: convert(simpleOperation, accountId.create, "destination"),
    startingBalance: convert(simpleOperation, int64.createPositive, "startingBalanceStroops")
  };
}

export function simplify(operation: xdr.CreateAccountOp, sourceAccount?: string): SimpleCreateAccountOp {
  return {
    type: "createAccount",
    sourceAccount,
    destination: accountId.simplify(operation.destination),
    startingBalanceStroops: int64.simplify(operation.startingBalance)
  };
}
