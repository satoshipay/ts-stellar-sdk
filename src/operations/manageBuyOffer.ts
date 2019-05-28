import { xdr } from "ts-stellar-xdr";

import { SimpleAsset, createAsset, simplifyAsset } from "../simpleTypes/asset";
import { SimpleInt64, createInt64, createNonNegativeInt64, simplifyInt64 } from "../simpleTypes/int64";
import { SimplePrice, createPrice, simplifyPrice } from "../simpleTypes/price";
import { convert } from "../operation";

export interface SimpleManageBuyOfferOp {
  type: "manageBuyOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  buyAmountStroops: SimpleInt64;
  price: SimplePrice;
  offerId?: SimpleInt64;
}

export function createManageBuyOfferOp(simpleOperation: SimpleManageBuyOfferOp): xdr.ManageBuyOfferOp {
  return {
    selling: convert(simpleOperation, createAsset, "selling"),
    buying: convert(simpleOperation, createAsset, "buying"),
    buyAmount: convert(simpleOperation, createNonNegativeInt64, "buyAmountStroops"),
    price: convert(simpleOperation, createPrice, "price"),
    offerId: convert({ offerId: simpleOperation.offerId || 0 }, createInt64, "offerId")
  };
}

export function simplifyManageBuyOfferOp(
  operation: xdr.ManageBuyOfferOp,
  sourceAccount?: string
): SimpleManageBuyOfferOp {
  const offerId = simplifyInt64(operation.offerId);

  return {
    type: "manageBuyOffer",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    selling: simplifyAsset(operation.selling),
    buying: simplifyAsset(operation.buying),
    buyAmountStroops: simplifyInt64(operation.buyAmount),
    price: simplifyPrice(operation.price),
    ...(offerId === 0 ? null : { offerId })
  };
}
