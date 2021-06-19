import { xdr } from "ts-stellar-xdr";

import * as signer from "../simpleTypes/signer";
import * as accountId from "../simpleTypes/accountId";
import * as weight from "../simpleTypes/weight";
import * as number from "../simpleTypes/number";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convertOptional } from "../utils/conversion";

export interface SimpleSetOptionsOp {
  type: "setOptions";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  inflationDest?: string;
  clearFlags?: number;
  setFlags?: number;
  masterWeight?: number;
  lowThreshold?: number;
  medThreshold?: number;
  highThreshold?: number;
  homeDomain?: string;
  signer?: signer.SimpleSigner;
}

export function create(simpleOperation: SimpleSetOptionsOp): xdr.SetOptionsOp {
  if (simpleOperation.homeDomain !== undefined && !xdr.String32.isValid(simpleOperation.homeDomain)) {
    throw new Error(`homeDomain invalid or too long – only 32 bytes allowed`);
  }

  return {
    inflationDest: convertOptional(simpleOperation, accountId.create, "inflationDest"),
    clearFlags: convertOptional(simpleOperation, number.valiateNonnegative, "clearFlags"),
    setFlags: convertOptional(simpleOperation, number.valiateNonnegative, "setFlags"),
    masterWeight: convertOptional(simpleOperation, weight.validate, "masterWeight"),
    lowThreshold: convertOptional(simpleOperation, weight.validate, "lowThreshold"),
    medThreshold: convertOptional(simpleOperation, weight.validate, "medThreshold"),
    highThreshold: convertOptional(simpleOperation, weight.validate, "highThreshold"),
    homeDomain: simpleOperation.homeDomain,
    signer: convertOptional(simpleOperation, signer.create, "signer")
  };
}

export function simplify(
  operation: xdr.SetOptionsOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleSetOptionsOp {
  return {
    type: "setOptions",
    sourceAccount,
    inflationDest: operation.inflationDest && accountId.simplify(operation.inflationDest),
    clearFlags: operation.clearFlags && operation.clearFlags,
    setFlags: operation.setFlags && operation.setFlags,
    masterWeight: operation.masterWeight && operation.masterWeight,
    lowThreshold: operation.lowThreshold && operation.lowThreshold,
    medThreshold: operation.medThreshold && operation.medThreshold,
    highThreshold: operation.highThreshold && operation.highThreshold,
    homeDomain: operation.homeDomain && operation.homeDomain,
    signer: operation.signer && signer.simplify(operation.signer)
  };
}
