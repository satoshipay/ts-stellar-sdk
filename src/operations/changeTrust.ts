import { ChangeTrustOp, Integer64 } from "ts-stellar-xdr";

import { SimpleAsset, createAsset } from "../simpleTypes/asset";
import { SimpleInt64, createNonNegativeInt64 } from "../simpleTypes/int64";
import { convert } from "../operation";

export interface SimpleChangeTrustOp {
  type: "changeTrust";
  sourceAccount?: string;
  line: SimpleAsset;
  limitStroops?: SimpleInt64;
}

export function createChangeTrustOp(simpleOperation: SimpleChangeTrustOp): ChangeTrustOp {
  let limit: Integer64;
  if (simpleOperation.limitStroops) {
    limit = convert({ limitStroops: simpleOperation.limitStroops }, createNonNegativeInt64, "limitStroops");
  } else {
    limit = Integer64.maxValue;
  }

  return {
    line: convert(simpleOperation, createAsset, "line"),
    limit
  };
}
