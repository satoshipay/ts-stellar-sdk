export function createPositiveNumber(value: number) {
  if (value < 0 || value > Number.MAX_SAFE_INTEGER || !isFinite(value) || isNaN(value)) {
    throw new Error(`value must be a positive number`);
  }
  return value;
}

export function createWeight(value: number) {
  if (value > 255) {
    throw new Error(`value must be <= 255`);
  }
  return createPositiveNumber(value);
}
