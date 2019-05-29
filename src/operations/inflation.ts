export interface SimpleInflationOp {
  type: "inflation";
  sourceAccount?: string;
}

export function simplify(sourceAccount?: string): SimpleInflationOp {
  return {
    type: "inflation",
    sourceAccount
  };
}
