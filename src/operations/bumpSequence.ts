import { BumpSequenceOp } from "ts-stellar-xdr";
import { createNonNegativeInt64, SimpleInt64 } from "../simpleTypes/int64";
import { convert } from "../operation";

export interface SimpleBumpSequenceOp {
  type: "bumpSequence";
  sourceAccount?: string;
  bumpTo: SimpleInt64;
}

export function createBumpSequenceOp(simpleOperation: SimpleBumpSequenceOp): BumpSequenceOp {
  return {
    bumpTo: convert(simpleOperation, createNonNegativeInt64, "bumpTo")
  };
}
