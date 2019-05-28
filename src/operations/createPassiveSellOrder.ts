import { xdr } from "ts-stellar-xdr";

import { SimpleAsset, createAsset, simplifyAsset } from "../simpleTypes/asset";
import { SimpleInt64, createPositiveInt64, simplifyInt64 } from "../simpleTypes/int64";
import { SimplePrice, createPrice, simplifyPrice } from "../simpleTypes/price";
import { convert } from "../operation";

export interface SimpleCreatePassiveSellOfferOp {
  type: "createPassiveSellOffer";
  sourceAccount?: string;
  selling: SimpleAsset;
  buying: SimpleAsset;
  amountStroops: SimpleInt64;
  price: SimplePrice;
}

export function createPassiveSellOfferOp(
  simpleOperation: SimpleCreatePassiveSellOfferOp
): xdr.CreatePassiveSellOfferOp {
  return {
    selling: convert(simpleOperation, createAsset, "selling"),
    buying: convert(simpleOperation, createAsset, "buying"),
    amount: convert(simpleOperation, createPositiveInt64, "amountStroops"),
    price: convert(simpleOperation, createPrice, "price")
  };
}

export function simplifyPassiveSellOfferOp(
  operation: xdr.CreatePassiveSellOfferOp,
  sourceAccount?: string
): SimpleCreatePassiveSellOfferOp {
  return {
    type: "createPassiveSellOffer",
    ...(sourceAccount === undefined ? null : { sourceAccount }),
    selling: simplifyAsset(operation.selling),
    buying: simplifyAsset(operation.buying),
    amountStroops: simplifyInt64(operation.amount),
    price: simplifyPrice(operation.price)
  };
}
