import { xdr } from "ts-stellar-xdr";

import { SimpleAsset, createAsset, simplifyAsset } from "../simpleTypes/asset";
import { convert } from "../utils/conversion";
import { SimpleInt64, createNonNegativeInt64, createInt64, simplifyInt64 } from "../simpleTypes/int64";
import { SimplePrice, createPrice, simplifyPrice } from "../simpleTypes/price";

export interface SimpleManageSellOfferOp {
  type: "manageSellOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  amountStroops: SimpleInt64;
  price: SimplePrice;
  offerId?: SimpleInt64;
}

export function createManageSellOfferOp(simpleOperation: SimpleManageSellOfferOp): xdr.ManageSellOfferOp {
  return {
    selling: convert(simpleOperation, createAsset, "selling"),
    buying: convert(simpleOperation, createAsset, "buying"),
    amount: convert(simpleOperation, createNonNegativeInt64, "amountStroops"),
    price: convert(simpleOperation, createPrice, "price"),
    offerId: convert({ offerId: simpleOperation.offerId || 0 }, createInt64, "offerId")
  };
}

export function simplifyManageSellOfferOp(
  operation: xdr.ManageSellOfferOp,
  sourceAccount?: string
): SimpleManageSellOfferOp {
  const offerId = simplifyInt64(operation.offerId);

  return {
    type: "manageSellOffer",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    selling: simplifyAsset(operation.selling),
    buying: simplifyAsset(operation.buying),
    amountStroops: simplifyInt64(operation.amount),
    price: simplifyPrice(operation.price),
    ...(offerId === 0 ? null : { offerId })
  };
}
