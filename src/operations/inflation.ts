import * as muxedAccount from "../simpleTypes/muxedAccount";

export interface SimpleInflationOp {
  type: "inflation";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
}

export function simplify(sourceAccount?: muxedAccount.SimpleMuxedAccount): SimpleInflationOp {
  return {
    type: "inflation",
    sourceAccount
  };
}
