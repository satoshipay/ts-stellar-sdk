import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as price from "../simpleTypes/price";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleCreatePassiveSellOfferOp {
  type: "createPassiveSellOffer";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  selling: asset.SimpleAsset;
  buying: asset.SimpleAsset;
  amountStroops: int64.SimpleInt64;
  price: price.SimplePrice;
}

export function create(simpleOperation: SimpleCreatePassiveSellOfferOp): xdr.CreatePassiveSellOfferOp {
  return {
    selling: convert(simpleOperation, asset.create, "selling"),
    buying: convert(simpleOperation, asset.create, "buying"),
    amount: convert(simpleOperation, int64.createPositive, "amountStroops"),
    price: convert(simpleOperation, price.create, "price")
  };
}

export function simplify(
  operation: xdr.CreatePassiveSellOfferOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleCreatePassiveSellOfferOp {
  return {
    type: "createPassiveSellOffer",
    sourceAccount,
    selling: asset.simplify(operation.selling),
    buying: asset.simplify(operation.buying),
    amountStroops: int64.simplify(operation.amount),
    price: price.simplify(operation.price)
  };
}
