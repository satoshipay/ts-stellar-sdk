import { xdr } from "ts-stellar-xdr";

import { createAccountId, simplifyAccountId } from "../simpleTypes/accountId";
import { convert } from "../operation";
import { SimpleAsset, createAsset, simplifyAsset } from "../simpleTypes/asset";
import { SimpleInt64, createPositiveInt64, simplifyInt64 } from "../simpleTypes/int64";

export interface SimplePaymentOp {
  type: "payment";
  sourceAccount?: string;
  destination: string;
  asset: SimpleAsset;
  amountStroops: SimpleInt64;
}

export function createPaymentOp(simpleOperation: SimplePaymentOp): xdr.PaymentOp {
  return {
    destination: convert(simpleOperation, createAccountId, "destination"),
    asset: convert(simpleOperation, createAsset, "asset"),
    amount: convert(simpleOperation, createPositiveInt64, "amountStroops")
  };
}

export function simplifyPaymentOp(operation: xdr.PaymentOp, sourceAccount?: string): SimplePaymentOp {
  return {
    type: "payment",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    destination: simplifyAccountId(operation.destination),
    asset: simplifyAsset(operation.asset),
    amountStroops: simplifyInt64(operation.amount)
  };
}
