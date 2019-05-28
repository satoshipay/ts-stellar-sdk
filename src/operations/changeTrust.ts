import { xdr, int64 } from "ts-stellar-xdr";

import { SimpleAsset, createAsset, simplifyAsset } from "../simpleTypes/asset";
import { SimpleInt64, createNonNegativeInt64, simplifyInt64 } from "../simpleTypes/int64";
import { convert } from "../operation";

export interface SimpleChangeTrustOp {
  type: "changeTrust";
  sourceAccount?: string;
  line: SimpleAsset;
  limitStroops?: SimpleInt64;
}

export function createChangeTrustOp(simpleOperation: SimpleChangeTrustOp): xdr.ChangeTrustOp {
  let limit: int64.Signed;
  if (simpleOperation.limitStroops) {
    limit = convert({ limitStroops: simpleOperation.limitStroops }, createNonNegativeInt64, "limitStroops");
  } else {
    limit = int64.Signed.maxValue;
  }

  return {
    line: convert(simpleOperation, createAsset, "line"),
    limit
  };
}

export function simplifyChangeTrustOp(operation: xdr.ChangeTrustOp, sourceAccount?: string): SimpleChangeTrustOp {
  return {
    type: "changeTrust",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    line: simplifyAsset(operation.line),
    ...(operation.limit.equals(int64.Signed.maxValue) ? null : { limitStroops: simplifyInt64(operation.limit) })
  };
}
