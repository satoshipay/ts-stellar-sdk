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

export interface PriceResponse {
  n: number;
  d: number;
}
