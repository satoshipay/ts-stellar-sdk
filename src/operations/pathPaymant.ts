import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as accountId from "../simpleTypes/accountId";
import * as int64 from "../simpleTypes/int64";
import { convert } from "../utils/conversion";

export interface SimplePathPaymentOp {
  type: "pathPayment";
  sourceAccount?: string;
  sendAsset: asset.SimpleAsset;
  sendMaxStroops: int64.SimpleInt64;
  destination: string;
  destAsset: asset.SimpleAsset;
  destAmountStroops: int64.SimpleInt64;
  path?: asset.SimpleAsset[];
}

export function create(simpleOperation: SimplePathPaymentOp): xdr.PathPaymentOp {
  const path = (simpleOperation.path || []).map((simpleAsset, index) => {
    try {
      return asset.create(simpleAsset);
    } catch (error) {
      throw new Error(`path contains invalid asset at position ${index}: ${error.message}`);
    }
  });

  return {
    sendAsset: convert(simpleOperation, asset.create, "sendAsset"),
    sendMax: convert(simpleOperation, int64.createPositive, "sendMaxStroops"),
    destination: convert(simpleOperation, accountId.create, "destination"),
    destAsset: convert(simpleOperation, asset.create, "destAsset"),
    destAmount: convert(simpleOperation, int64.createPositive, "destAmountStroops"),
    path
  };
}

export function simplify(operation: xdr.PathPaymentOp, sourceAccount?: string): SimplePathPaymentOp {
  const path = operation.path.map(asset.simplify);

  return {
    type: "pathPayment",
    sourceAccount,
    sendAsset: asset.simplify(operation.sendAsset),
    sendMaxStroops: int64.simplify(operation.sendMax),
    destination: accountId.simplify(operation.destination),
    destAsset: asset.simplify(operation.destAsset),
    destAmountStroops: int64.simplify(operation.destAmount),
    path
  };
}
