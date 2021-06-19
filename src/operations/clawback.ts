import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleClawbackOp {
  type: "clawback";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  asset: asset.SimpleAsset;
  from: muxedAccount.SimpleMuxedAccount;
  amountStroops: int64.SimpleInt64;
}

export function create(simpleOperation: SimpleClawbackOp): xdr.ClawbackOp {
  return {
    asset: convert(simpleOperation, asset.create, "asset"),
    from: convert(simpleOperation, muxedAccount.create, "from"),
    amount: convert(simpleOperation, int64.createNonnegative, "amountStroops")
  };
}

export function simplify(operation: xdr.ClawbackOp, sourceAccount?: muxedAccount.SimpleMuxedAccount): SimpleClawbackOp {
  return {
    type: "clawback",
    sourceAccount,
    asset: asset.simplify(operation.asset),
    from: muxedAccount.simplify(operation.from),
    amountStroops: int64.simplify(operation.amount)
  };
}
