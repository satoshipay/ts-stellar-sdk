import { xdr } from "ts-stellar-xdr";

import { convert } from "../utils/conversion";
import { createAccountId, simplifyAccountId } from "../simpleTypes/accountId";
import { createAllowTrustOpAsset, simplifyAllowTrustOpAsset } from "../simpleTypes/asset";

export interface SimpleAllowTrustOp {
  type: "allowTrust";
  sourceAccount?: string;
  trustor: string;
  asset: string;
  authorize: boolean;
}

export function createAllowTrustOp(simpleOperation: SimpleAllowTrustOp): xdr.AllowTrustOp {
  return {
    trustor: convert(simpleOperation, createAccountId, "trustor"),
    asset: convert(simpleOperation, createAllowTrustOpAsset, "asset"),
    authorize: simpleOperation.authorize
  };
}

export function simplifyAllowTrustOp(operation: xdr.AllowTrustOp, sourceAccount?: string): SimpleAllowTrustOp {
  return {
    type: "allowTrust",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    trustor: simplifyAccountId(operation.trustor),
    asset: simplifyAllowTrustOpAsset(operation.asset),
    authorize: operation.authorize
  };
}
