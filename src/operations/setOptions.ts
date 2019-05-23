import { SetOptionsOp, String32 } from "ts-stellar-xdr";

import { SimpleSigner, createSigner } from "../simpleTypes/signer";
import { convertOptional } from "../operation";
import { createAccountId } from "../simpleTypes/accountId";
import { createPositiveNumber, createWeight } from "../simpleTypes/weight";

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

export function createSetOptionstOp(simpleOperation: SimpleSetOptionsOp): SetOptionsOp {
  if (simpleOperation.homeDomain !== undefined && !String32.isValid(simpleOperation.homeDomain)) {
    throw new Error(`homeDomain invalid or too long – only 32 bytes allowed`);
  }

  return {
    inflationDest: convertOptional(simpleOperation, createAccountId, "inflationDest"),
    clearFlags: convertOptional(simpleOperation, createPositiveNumber, "clearFlags"),
    setFlags: convertOptional(simpleOperation, createPositiveNumber, "setFlags"),
    masterWeight: convertOptional(simpleOperation, createWeight, "masterWeight"),
    lowThreshold: convertOptional(simpleOperation, createWeight, "lowThreshold"),
    medThreshold: convertOptional(simpleOperation, createWeight, "medThreshold"),
    highThreshold: convertOptional(simpleOperation, createWeight, "highThreshold"),
    homeDomain: simpleOperation.homeDomain,
    signer: convertOptional(simpleOperation, createSigner, "signer")
  };
}
