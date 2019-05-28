import { xdr } from "ts-stellar-xdr";

import { SimpleAsset, createAsset, simplifyAsset } from "../simpleTypes/asset";
import { convert } from "../operation";
import { createAccountId, simplifyAccountId } from "../simpleTypes/accountId";
import { SimpleInt64, createPositiveInt64, simplifyInt64 } from "../simpleTypes/int64";

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

export function createPathPaymentOp(simpleOperation: SimplePathPaymentOp): xdr.PathPaymentOp {
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

export function simplifyPathPaymentOp(operation: xdr.PathPaymentOp, sourceAccount?: string): SimplePathPaymentOp {
  const path = operation.path.map(simplifyAsset);

  return {
    type: "pathPayment",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    sendAsset: simplifyAsset(operation.sendAsset),
    sendMaxStroops: simplifyInt64(operation.sendMax),
    destination: simplifyAccountId(operation.destination),
    destAsset: simplifyAsset(operation.destAsset),
    destAmountStroops: simplifyInt64(operation.destAmount),
    ...(path.length === 0 ? null : { path })
  };
}
