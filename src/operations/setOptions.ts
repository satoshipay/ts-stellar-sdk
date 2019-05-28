import { xdr } from "ts-stellar-xdr";

import { SimpleSigner, createSigner, simplifySigner } from "../simpleTypes/signer";
import { convertOptional } from "../operation";
import { createAccountId, simplifyAccountId } from "../simpleTypes/accountId";
import { createNonnegativeNumber, createWeight } from "../simpleTypes/weight";

export interface SimpleSetOptionsOp {
  type: "setOption";
  sourceAccount?: string;
  inflationDest?: string;
  clearFlags?: number;
  setFlags?: number;
  masterWeight?: number;
  lowThreshold?: number;
  medThreshold?: number;
  highThreshold?: number;
  homeDomain?: string;
  signer?: SimpleSigner;
}

export function createSetOptionstOp(simpleOperation: SimpleSetOptionsOp): xdr.SetOptionsOp {
  if (simpleOperation.homeDomain !== undefined && !xdr.String32.isValid(simpleOperation.homeDomain)) {
    throw new Error(`homeDomain invalid or too long – only 32 bytes allowed`);
  }

  return {
    inflationDest: convertOptional(simpleOperation, createAccountId, "inflationDest"),
    clearFlags: convertOptional(simpleOperation, createNonnegativeNumber, "clearFlags"),
    setFlags: convertOptional(simpleOperation, createNonnegativeNumber, "setFlags"),
    masterWeight: convertOptional(simpleOperation, createWeight, "masterWeight"),
    lowThreshold: convertOptional(simpleOperation, createWeight, "lowThreshold"),
    medThreshold: convertOptional(simpleOperation, createWeight, "medThreshold"),
    highThreshold: convertOptional(simpleOperation, createWeight, "highThreshold"),
    homeDomain: simpleOperation.homeDomain,
    signer: convertOptional(simpleOperation, createSigner, "signer")
  };
}

export function simplifySetOptionstOp(operation: xdr.SetOptionsOp, sourceAccount?: string): SimpleSetOptionsOp {
  return {
    type: "setOption",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    ...(operation.inflationDest ? { inflationDest: simplifyAccountId(operation.inflationDest) } : null),
    ...(operation.clearFlags ? { clearFlags: operation.clearFlags } : null),
    ...(operation.setFlags ? { setFlags: operation.setFlags } : null),
    ...(operation.masterWeight ? { masterWeight: operation.masterWeight } : null),
    ...(operation.lowThreshold ? { lowThreshold: operation.lowThreshold } : null),
    ...(operation.medThreshold ? { medThreshold: operation.medThreshold } : null),
    ...(operation.highThreshold ? { highThreshold: operation.highThreshold } : null),
    ...(operation.homeDomain ? { homeDomain: operation.homeDomain } : null),
    ...(operation.signer ? { signer: simplifySigner(operation.signer) } : null)
  };
}
