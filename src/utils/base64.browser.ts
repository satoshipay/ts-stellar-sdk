export function fromBinary(arrayBuffer: ArrayBuffer): string {
  const array = Array.from(new Uint8Array(arrayBuffer));
  return btoa(String.fromCharCode.apply(null, array));
}

export function toBinary(string: string): ArrayBuffer {
  const binaryString = atob(string);

  const uint8Array = new Uint8Array(binaryString.length);
  uint8Array.forEach((_, idx) => {
    uint8Array[idx] = binaryString.charCodeAt(idx);
  });

  return uint8Array.buffer;
}
