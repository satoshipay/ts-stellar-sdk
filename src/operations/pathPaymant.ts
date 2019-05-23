import { PathPaymentOp } from "ts-stellar-xdr";

import { SimpleAsset, createAsset } from "../simpleTypes/asset";
import { convert } from "../operation";
import { createAccountId } from "../simpleTypes/accountId";
import { SimpleInt64, createPositiveInt64 } from "../simpleTypes/int64";

export interface SimplePathPaymentOp {
  type: "pathPayment";
  sourceAccount?: string;
  sendAsset: SimpleAsset;
  sendMaxStroops: SimpleInt64;
  destination: string;
  destAsset: SimpleAsset;
  destAmountStroops: SimpleInt64;
  path?: SimpleAsset[];
}

export function createPathPaymentOp(simpleOperation: SimplePathPaymentOp): PathPaymentOp {
  const path = (simpleOperation.path || []).map((simpleAsset, index) => {
    try {
      return createAsset(simpleAsset);
    } catch (error) {
      throw new Error(`path contains invalid asset at position ${index}: ${error.message}`);
    }
  });

  return {
    sendAsset: convert(simpleOperation, createAsset, "sendAsset"),
    sendMax: convert(simpleOperation, createPositiveInt64, "sendMaxStroops"),
    destination: convert(simpleOperation, createAccountId, "destination"),
    destAsset: convert(simpleOperation, createAsset, "destAsset"),
    destAmount: convert(simpleOperation, createPositiveInt64, "destAmountStroops"),
    path
  };
}
