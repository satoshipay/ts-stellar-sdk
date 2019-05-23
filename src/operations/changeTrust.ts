import { ChangeTrustOp } from "ts-stellar-xdr";
import { Int64 } from "ts-stellar-xdr/lib/utils";

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
  const limitStroops = { limitStroops: simpleOperation.limitStroops || Int64.maxValue };

  return {
    line: convert(simpleOperation, createAsset, "line"),
    limit: convert(limitStroops, createNonNegativeInt64, "limitStroops")
  };
}
