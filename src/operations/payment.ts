import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import { convert } from "../utils/conversion";

export interface SimplePaymentOp {
  type: "payment";
  sourceAccount?: string;
  destination: string;
  asset: asset.SimpleAsset;
  amountStroops: int64.SimpleInt64;
}

export function create(simpleOperation: SimplePaymentOp): xdr.PaymentOp {
  return {
    destination: convert(simpleOperation, accountId.create, "destination"),
    asset: convert(simpleOperation, asset.create, "asset"),
    amount: convert(simpleOperation, int64.createPositive, "amountStroops")
  };
}

export function simplify(operation: xdr.PaymentOp, sourceAccount?: string): SimplePaymentOp {
  return {
    type: "payment",
    sourceAccount,
    destination: accountId.simplify(operation.destination),
    asset: asset.simplify(operation.asset),
    amountStroops: int64.simplify(operation.amount)
  };
}
