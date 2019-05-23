import { PaymentOp } from "ts-stellar-xdr";

import { createAccountId } from "../simpleTypes/accountId";
import { convert } from "../operation";
import { SimpleAsset, createAsset } from "../simpleTypes/asset";
import { SimpleInt64, createPositiveInt64 } from "../simpleTypes/int64";

export interface SimplePaymentOp {
  type: "payment";
  sourceAccount?: string;
  destination: string;
  asset: SimpleAsset;
  amountStroops: SimpleInt64;
}

export function createPaymentOp(simpleOperation: SimplePaymentOp): PaymentOp {
  return {
    destination: convert(simpleOperation, createAccountId, "destination"),
    asset: convert(simpleOperation, createAsset, "asset"),
    amount: convert(simpleOperation, createPositiveInt64, "amountStroops")
  };
}
