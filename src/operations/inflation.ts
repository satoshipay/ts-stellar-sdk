export interface SimpleInflationOp {
  type: "inflation";
  sourceAccount?: string;
}

export function simplifyInflationOp(sourceAccount?: string): SimpleInflationOp {
  return {
    type: "inflation",
    ...(sourceAccount === undefined ? null : { sourceAccount })
  };
}
