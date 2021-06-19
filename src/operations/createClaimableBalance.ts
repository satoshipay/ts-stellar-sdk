import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as claimPrediate from "../simpleTypes/claimPredicate";
import * as int64 from "../simpleTypes/int64";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import * as accountId from "../simpleTypes/accountId";
import { convert } from "../utils/conversion";

export interface SimpleCreateClaimableBalanceOp {
  type: "createClaimableBalance";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  asset: asset.SimpleAsset;
  amountStroops: int64.SimpleInt64;
  claimants: Array<{ destination: string; predicate: claimPrediate.SimpleClaimPredicate }>;
}

export function create(simpleOperation: SimpleCreateClaimableBalanceOp): xdr.CreateClaimableBalanceOp {
  return {
    asset: convert(simpleOperation, asset.create, "asset"),
    amount: convert(simpleOperation, int64.create, "amountStroops"),
    claimants: simpleOperation.claimants.map(claimant => ({
      type: "claimantTypeV0",
      value: {
        destination: convert(claimant, accountId.create, "destination"),
        predicate: convert(claimant, claimPrediate.create, "predicate")
      }
    }))
  };
}

export function simplify(
  operation: xdr.CreateClaimableBalanceOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleCreateClaimableBalanceOp {
  return {
    type: "createClaimableBalance",
    sourceAccount,
    asset: asset.simplify(operation.asset),
    amountStroops: int64.simplify(operation.amount),
    claimants: operation.claimants.map(claimant => ({
      destination: accountId.simplify(claimant.value.destination),
      predicate: claimPrediate.simplify(claimant.value.predicate)
    }))
  };
}
