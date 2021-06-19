import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleBeginSponsoringFutureReservesOp {
  type: "beginSponsoringFutureReserves";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  sponsoredId: string;
}

export function create(simpleOperation: SimpleBeginSponsoringFutureReservesOp): xdr.BeginSponsoringFutureReservesOp {
  return { sponsoredId: convert(simpleOperation, accountId.create, "sponsoredId") };
}

export function simplify(
  operation: xdr.BeginSponsoringFutureReservesOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleBeginSponsoringFutureReservesOp {
  return {
    type: "beginSponsoringFutureReserves",
    sourceAccount,
    sponsoredId: accountId.simplify(operation.sponsoredId)
  };
}
