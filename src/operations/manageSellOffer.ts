import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as price from "../simpleTypes/price";
import * as muxedAccount from "../simpleTypes/muxedAccount";
import { convert } from "../utils/conversion";

export interface SimpleManageSellOfferOp {
  type: "manageSellOffer";
  sourceAccount?: muxedAccount.SimpleMuxedAccount;
  selling: asset.SimpleAsset;
  buying: asset.SimpleAsset;
  amountStroops: int64.SimpleInt64;
  price: price.SimplePrice;
  offerId?: int64.SimpleInt64;
}

export function create(simpleOperation: SimpleManageSellOfferOp): xdr.ManageSellOfferOp {
  return {
    selling: convert(simpleOperation, asset.create, "selling"),
    buying: convert(simpleOperation, asset.create, "buying"),
    amount: convert(simpleOperation, int64.createNonnegative, "amountStroops"),
    price: convert(simpleOperation, price.create, "price"),
    offerId: convert({ offerId: simpleOperation.offerId || 0 }, int64.create, "offerId")
  };
}

export function simplify(
  operation: xdr.ManageSellOfferOp,
  sourceAccount?: muxedAccount.SimpleMuxedAccount
): SimpleManageSellOfferOp {
  const offerId = int64.simplify(operation.offerId);

  return {
    type: "manageSellOffer",
    sourceAccount,
    selling: asset.simplify(operation.selling),
    buying: asset.simplify(operation.buying),
    amountStroops: int64.simplify(operation.amount),
    price: price.simplify(operation.price),
    offerId
  };
}
