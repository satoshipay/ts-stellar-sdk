import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimplePaymentOp {
  type: "payment";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  destination: muxedAccount.SimpleMuxedAccount;
  asset: asset.SimpleAsset;
  amountStroops: int64.SimpleInt64;
}

export function create(simpleOperation: SimplePaymentOp): xdr.PaymentOp {
  return {
    destination: convert(simpleOperation, muxedAccount.create, "destination"),
    asset: convert(simpleOperation, asset.create, "asset"),
    amount: convert(simpleOperation, int64.createPositive, "amountStroops")
  };
}

export function simplify(operation: xdr.PaymentOp, sourceAccount?: muxedAccount.SimpleMuxedAccount): SimplePaymentOp {
  return {
    type: "payment",
    sourceAccount,
    destination: muxedAccount.simplify(operation.destination),
    asset: asset.simplify(operation.asset),
    amountStroops: int64.simplify(operation.amount)
  };
}
