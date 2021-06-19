import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import * as assetCode from "../simpleTypes/assetCode";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleAllowTrustOp {
  type: "allowTrust";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  trustor: string;
  asset: string;
  authorize: number;
}

export function create(simpleOperation: SimpleAllowTrustOp): xdr.AllowTrustOp {
  return {
    trustor: convert(simpleOperation, accountId.create, "trustor"),
    asset: convert(simpleOperation, assetCode.create, "asset"),
    authorize: simpleOperation.authorize
  };
}

export function simplify(
  operation: xdr.AllowTrustOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleAllowTrustOp {
  return {
    type: "allowTrust",
    sourceAccount,
    trustor: accountId.simplify(operation.trustor),
    asset: assetCode.simplify(operation.asset),
    authorize: operation.authorize
  };
}
