import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import * as allowTrustOpAsset from "../simpleTypes/allowTrustOpAsset";
import { convert } from "../utils/conversion";

export interface SimpleAllowTrustOp {
  type: "allowTrust";
  sourceAccount?: string;
  trustor: string;
  asset: string;
  authorize: boolean;
}

export function create(simpleOperation: SimpleAllowTrustOp): xdr.AllowTrustOp {
  return {
    trustor: convert(simpleOperation, accountId.create, "trustor"),
    asset: convert(simpleOperation, allowTrustOpAsset.create, "asset"),
    authorize: simpleOperation.authorize
  };
}

export function simplify(operation: xdr.AllowTrustOp, sourceAccount?: string): SimpleAllowTrustOp {
  return {
    type: "allowTrust",
    sourceAccount,
    trustor: accountId.simplify(operation.trustor),
    asset: allowTrustOpAsset.simplify(operation.asset),
    authorize: operation.authorize
  };
}
