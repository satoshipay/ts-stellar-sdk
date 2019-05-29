export function valiateNonnegative(value: number): number {
  if (value < 0 || value > Number.MAX_SAFE_INTEGER || !isFinite(value) || isNaN(value) || value % 1 !== 0) {
    throw new Error(`value must be a positive number`);
  }
  return value;
}
