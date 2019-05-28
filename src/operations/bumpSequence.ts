import { xdr } from "ts-stellar-xdr";

import { createNonNegativeInt64, SimpleInt64, simplifyInt64 } from "../simpleTypes/int64";
import { convert } from "../utils/conversion";

export interface SimpleBumpSequenceOp {
  type: "bumpSequence";
  sourceAccount?: string;
  bumpTo: SimpleInt64;
}

export function createBumpSequenceOp(simpleOperation: SimpleBumpSequenceOp): xdr.BumpSequenceOp {
  return {
    bumpTo: convert(simpleOperation, createNonNegativeInt64, "bumpTo")
  };
}

export function simplifyBumpSequenceOp(operation: xdr.BumpSequenceOp, sourceAccount?: string): SimpleBumpSequenceOp {
  return {
    type: "bumpSequence",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    bumpTo: simplifyInt64(operation.bumpTo)
  };
}
