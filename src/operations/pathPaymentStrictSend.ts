import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimplePathPaymentStrictSendOp {
  type: "pathPaymentStrictSend";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  sendAsset: asset.SimpleAsset;
  sendAmountStroops: int64.SimpleInt64;
  destination: muxedAccount.SimpleMuxedAccount;
  destAsset: asset.SimpleAsset;
  destMinStroops: int64.SimpleInt64;
  path?: asset.SimpleAsset[];
}

export function create(simpleOperation: SimplePathPaymentStrictSendOp): xdr.PathPaymentStrictSendOp {
  const path = (simpleOperation.path || []).map((simpleAsset, index) => {
    try {
      return asset.create(simpleAsset);
    } catch (error) {
      throw new Error(`path contains invalid asset at position ${index}: ${error.message}`);
    }
  });

  return {
    sendAsset: convert(simpleOperation, asset.create, "sendAsset"),
    sendAmount: convert(simpleOperation, int64.createPositive, "sendAmountStroops"),
    destination: convert(simpleOperation, muxedAccount.create, "destination"),
    destAsset: convert(simpleOperation, asset.create, "destAsset"),
    destMin: convert(simpleOperation, int64.createPositive, "destMinStroops"),
    path
  };
}

export function simplify(
  operation: xdr.PathPaymentStrictSendOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimplePathPaymentStrictSendOp {
  const path = operation.path.map(asset.simplify);

  return {
    type: "pathPaymentStrictSend",
    sourceAccount,
    sendAsset: asset.simplify(operation.sendAsset),
    sendAmountStroops: int64.simplify(operation.sendAmount),
    destination: muxedAccount.simplify(operation.destination),
    destAsset: asset.simplify(operation.destAsset),
    destMinStroops: int64.simplify(operation.destMin),
    path
  };
}
