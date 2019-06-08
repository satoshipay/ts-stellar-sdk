import * as asset from "../../simpleTypes/asset";

export interface HalLink {
  href: string;
  templated?: boolean;
}

export type HalLinks<T extends string, S extends string = never> = Record<T, HalLink> & Partial<Record<S, HalLink>>;

export interface Paged<T> {
  _links: HalLinks<"self" | "next" | "prev">;
  _embedded: {
    records: T[];
  };
}

export interface PagingOptions {
  cursor?: "now" | number;
  order?: "asc" | "desc";
  limit?: number;
}

export interface PriceResponse {
  n: number;
  d: number;
}

export function simpleAssetToAssetQuery(simpleAsset: asset.SimpleAsset) {
  if (simpleAsset === "native") {
    return { asset_type: "native" };
  }

  const xdrAsset = asset.create(simpleAsset);
  return {
    assetType: xdrAsset.type === "assetTypeCreditAlphanum4" ? "credit_alphanum4" : "credit_alphanum12",
    assetCode: simpleAsset.assetCode,
    assetIssuer: simpleAsset.issuer
  };
}
