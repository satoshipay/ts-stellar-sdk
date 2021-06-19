import { xdr, int64 } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as simpleInt64 from "../simpleTypes/int64";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleChangeTrustOp {
  type: "changeTrust";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  line: asset.SimpleAsset;
  limitStroops?: simpleInt64.SimpleInt64;
}

export function create(simpleOperation: SimpleChangeTrustOp): xdr.ChangeTrustOp {
  let limit: int64.Signed;
  if (simpleOperation.limitStroops) {
    limit = convert({ limitStroops: simpleOperation.limitStroops }, simpleInt64.createNonnegative, "limitStroops");
  } else {
    limit = int64.Signed.maxValue;
  }

  return {
    line: convert(simpleOperation, asset.create, "line"),
    limit
  };
}

export function simplify(
  operation: xdr.ChangeTrustOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleChangeTrustOp {
  return {
    type: "changeTrust",
    sourceAccount,
    line: asset.simplify(operation.line),
    limitStroops: operation.limit.equals(int64.Signed.maxValue) ? undefined : simpleInt64.simplify(operation.limit)
  };
}
