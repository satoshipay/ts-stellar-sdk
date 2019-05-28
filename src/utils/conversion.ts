export function convert<N extends string, T, S>(object: { [A in N]: S }, converter: (value: S) => T, name: N) {
  try {
    return converter(object[name]);
  } catch (error) {
    throw new Error(`${name} is invalid: ${error.message}`);
  }
}

export function convertOptional<N extends string, T, S>(object: { [A in N]?: S }, converter: (value: S) => T, name: N) {
  try {
    const value: S | undefined = object[name];
    if (typeof value === "undefined") {
      return undefined;
    }

    return converter(value);
  } catch (error) {
    throw new Error(`${name} is invalid: ${error.message}`);
  }
}
