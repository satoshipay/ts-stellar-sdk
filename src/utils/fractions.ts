export const MAX_INT32 = 0x7fffffff;

export function approximateAsFraction(number: number) {
  // approximate number as fraction constructing continued fraction
  let [numerator1, denominator1] = [0, 1];
  let [numerator2, denominator2] = [1, 0];

  while (number <= MAX_INT32) {
    const integerPart = Math.floor(number);
    const numerator = integerPart * numerator2 + numerator1;
    const denominator = integerPart * denominator2 + denominator1;
    if (numerator > MAX_INT32 || denominator > MAX_INT32) {
      break;
    }

    [numerator1, denominator1] = [numerator2, denominator2];
    [numerator2, denominator2] = [numerator, denominator];

    const fractionalPart = number - integerPart;
    if (fractionalPart === 0) {
      break;
    }
    number = 1 / fractionalPart;
  }

  if (numerator2 === 0 || denominator2 === 0) {
    throw new Error("Number cannot be approximated as positive fraction");
  }

  return { n: numerator2, d: denominator2 };
}
