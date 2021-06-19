import { xdr } from "ts-stellar-xdr";

import * as accountId from "../simpleTypes/accountId";
import * as number from "../simpleTypes/number";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import * as asset from "../simpleTypes/asset";
import { convert } from "../utils/conversion";

export interface SimpleSetTrustLineFlagsOp {
  type: "setTrustLineFlags";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  trustor: string;
  asset: asset.SimpleAsset;
  clearFlags: number;
  setFlags: number;
}

export function create(simpleOperation: SimpleSetTrustLineFlagsOp): xdr.SetTrustLineFlagsOp {
  return {
    trustor: convert(simpleOperation, accountId.create, "trustor"),
    asset: convert(simpleOperation, asset.create, "asset"),
    clearFlags: convert(simpleOperation, number.valiateNonnegative, "clearFlags"),
    setFlags: convert(simpleOperation, number.valiateNonnegative, "setFlags")
  };
}

export function simplify(
  operation: xdr.SetTrustLineFlagsOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleSetTrustLineFlagsOp {
  return {
    type: "setTrustLineFlags",
    sourceAccount,
    trustor: accountId.simplify(operation.trustor),
    asset: asset.simplify(operation.asset),
    clearFlags: operation.clearFlags,
    setFlags: operation.setFlags
  };
}
