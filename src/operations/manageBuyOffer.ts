import { xdr } from "ts-stellar-xdr";

import * as asset from "../simpleTypes/asset";
import * as int64 from "../simpleTypes/int64";
import * as price from "../simpleTypes/price";
import { convert } from "../utils/conversion";

export interface SimpleManageBuyOfferOp {
  type: "manageBuyOffer";
  sourceAccount?: string;
  selling: asset.SimpleAsset;
  buying: asset.SimpleAsset;
  buyAmountStroops: int64.SimpleInt64;
  price: price.SimplePrice;
  offerId?: int64.SimpleInt64;
}

export function create(simpleOperation: SimpleManageBuyOfferOp): xdr.ManageBuyOfferOp {
  return {
    selling: convert(simpleOperation, asset.create, "selling"),
    buying: convert(simpleOperation, asset.create, "buying"),
    buyAmount: convert(simpleOperation, int64.createNonnegative, "buyAmountStroops"),
    price: convert(simpleOperation, price.create, "price"),
    offerId: convert({ offerId: simpleOperation.offerId || 0 }, int64.create, "offerId")
  };
}

export function simplify(operation: xdr.ManageBuyOfferOp, sourceAccount?: string): SimpleManageBuyOfferOp {
  const offerId = int64.simplify(operation.offerId);

  return {
    type: "manageBuyOffer",
    sourceAccount,
    selling: asset.simplify(operation.selling),
    buying: asset.simplify(operation.buying),
    buyAmountStroops: int64.simplify(operation.buyAmount),
    price: price.simplify(operation.price),
    offerId
  };
}
