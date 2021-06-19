import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimplePathPaymentStrictReceiveOp {
  type: "pathPaymentStrictReceive";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  sendAsset: asset.SimpleAsset;
  sendMaxStroops: int64.SimpleInt64;
  destination: muxedAccount.SimpleMuxedAccount;
  destAsset: asset.SimpleAsset;
  destAmountStroops: int64.SimpleInt64;
  path?: asset.SimpleAsset[];
}

export function create(simpleOperation: SimplePathPaymentStrictReceiveOp): xdr.PathPaymentStrictReceiveOp {
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
    destination: convert(simpleOperation, muxedAccount.create, "destination"),
    destAsset: convert(simpleOperation, asset.create, "destAsset"),
    destAmount: convert(simpleOperation, int64.createPositive, "destAmountStroops"),
    path
  };
}

export function simplify(
  operation: xdr.PathPaymentStrictReceiveOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimplePathPaymentStrictReceiveOp {
  const path = operation.path.map(asset.simplify);

  return {
    type: "pathPaymentStrictReceive",
    sourceAccount,
    sendAsset: asset.simplify(operation.sendAsset),
    sendMaxStroops: int64.simplify(operation.sendMax),
    destination: muxedAccount.simplify(operation.destination),
    destAsset: asset.simplify(operation.destAsset),
    destAmountStroops: int64.simplify(operation.destAmount),
    path
  };
}
