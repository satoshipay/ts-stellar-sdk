import { xdr } from "ts-stellar-xdr";

import * as int64 from "../simpleTypes/int64";
import { convert } from "../utils/conversion";

export interface SimpleBumpSequenceOp {
  type: "bumpSequence";
  sourceAccount?: string;
  bumpTo: int64.SimpleInt64;
}

export function create(simpleOperation: SimpleBumpSequenceOp): xdr.BumpSequenceOp {
  return {
    bumpTo: convert(simpleOperation, int64.createNonnegative, "bumpTo")
  };
}

export function simplify(operation: xdr.BumpSequenceOp, sourceAccount?: string): SimpleBumpSequenceOp {
  return {
    type: "bumpSequence",
    sourceAccount,
    bumpTo: int64.simplify(operation.bumpTo)
  };
}
