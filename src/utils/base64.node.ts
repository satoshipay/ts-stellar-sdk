export function fromBinary(arrayBuffer: ArrayBuffer): string {
  return Buffer.from(arrayBuffer).toString("base64");
}

export function toBinary(string: string): ArrayBuffer {
  return Buffer.from(string, "base64").buffer;
}
