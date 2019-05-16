declare module "base32.js" {
  function encode(buf: Uint8Array | number[]): string;
  function decode(encoded: string): number[];
}
