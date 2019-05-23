import { AllowTrustOp } from "ts-stellar-xdr";

import { convert } from "../operation";
import { createAccountId } from "../simpleTypes/accountId";
import { createAllowTrustOpAsset } from "../simpleTypes/asset";

export interface SimpleAllowTrustOp {
  type: "allowTrust";
  sourceAccount?: string;
  trustor: string;
  asset: string;
  authorize: boolean;
}

export function createAllowTrustOp(simpleOperation: SimpleAllowTrustOp): AllowTrustOp {
  return {
    trustor: convert(simpleOperation, createAccountId, "trustor"),
    asset: convert(simpleOperation, createAllowTrustOpAsset, "asset"),
    authorize: simpleOperation.authorize
  };
}
