import { valiateNonnegative } from "./number";

export function validate(simpleWeight: number): number {
  if (simpleWeight > 255) {
    throw new Error(`value must be <= 255`);
  }
  return valiateNonnegative(simpleWeight);
}
