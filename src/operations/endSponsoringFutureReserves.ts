import * as muxedAccount from "../simpleTypes/muxedAccount";

export interface SimpleEndSponsoringFutureReservesOp {
  type: "endSponsoringFutureReserves";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
}

export function simplify(sourceAccount?: muxedAccount.SimpleMuxedAccount): SimpleEndSponsoringFutureReservesOp {
  return {
    type: "endSponsoringFutureReserves",
    sourceAccount
  };
}
