export function hexToBinary(hexString: string): ArrayBuffer {
  hexString = hexString.toLowerCase();

  const uint8Array = new Uint8Array(hexString.length / 2).map((_, index) => {
    const byteHex = hexString.substring(index * 2, index * 2 + 2);

    if (!/^[0-9a-f]{2}$/g.test(byteHex)) {
      throw new Error(`Invalid symbol in hex string ${hexString}`);
    }

    return parseInt(byteHex, 16);
  });

  return uint8Array.buffer;
}

export function binaryToHex(arrayBuffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(arrayBuffer))
    .map(entry => (entry < 16 ? "0" : "") + entry.toString(16))
    .join("");
}
