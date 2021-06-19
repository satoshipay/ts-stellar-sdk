import { xdr } from "ts-stellar-xdr";

import * as int64 from "./int64";

export type SimpleClaimPredicate =
  | {
      type: "unconditional";
    }
  | {
      type: "and";
      value: SimpleClaimPredicate[];
    }
  | {
      type: "or";
      value: SimpleClaimPredicate[];
    }
  | {
      type: "not";
      value?: SimpleClaimPredicate;
    }
  | {
      type: "beforeAbsoluteTime";
      value: int64.SimpleInt64;
    }
  | {
      type: "BeforeRelativeTime";
      value: int64.SimpleInt64;
    };

export function create(claimPredicate: SimpleClaimPredicate): xdr.ClaimPredicate {
  switch (claimPredicate.type) {
    case "unconditional":
      return { type: "claimPredicateUnconditional" };
    case "and":
      return { type: "claimPredicateAnd", value: claimPredicate.value.map(create) };
    case "or":
      return { type: "claimPredicateOr", value: claimPredicate.value.map(create) };
    case "not":
      return { type: "claimPredicateNot", value: claimPredicate.value ? create(claimPredicate.value) : undefined };
    case "beforeAbsoluteTime":
      return { type: "claimPredicateBeforeAbsoluteTime", value: int64.create(claimPredicate.value) };
    case "BeforeRelativeTime":
      return { type: "claimPredicateBeforeRelativeTime", value: int64.create(claimPredicate.value) };
  }
}

export function simplify(claimPredicate: xdr.ClaimPredicate): SimpleClaimPredicate {
  switch (claimPredicate.type) {
    case "claimPredicateUnconditional":
      return { type: "unconditional" };
    case "claimPredicateAnd":
      return { type: "and", value: claimPredicate.value.map(simplify) };
    case "claimPredicateOr":
      return { type: "or", value: claimPredicate.value.map(simplify) };
    case "claimPredicateNot":
      return { type: "not", value: claimPredicate.value ? simplify(claimPredicate.value) : undefined };
    case "claimPredicateBeforeAbsoluteTime":
      return { type: "beforeAbsoluteTime", value: int64.simplify(claimPredicate.value) };
    case "claimPredicateBeforeRelativeTime":
      return { type: "BeforeRelativeTime", value: int64.simplify(claimPredicate.value) };
  }
}
