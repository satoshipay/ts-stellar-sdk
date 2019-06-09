import { sign_keyPair_fromSeed, sign_detached, sign_detached_verify } from "./tweetnacl";

export function keyPairFromSeed(seed: ArrayBuffer): { publicKey: ArrayBuffer; secretKey: ArrayBuffer } {
  const tweetNaclKeypair = sign_keyPair_fromSeed(new Uint8Array(seed));

  return {
    publicKey: tweetNaclKeypair.publicKey.buffer,
    secretKey: tweetNaclKeypair.secretKey.buffer
  };
}

export function sign(data: ArrayBuffer, secretKey: ArrayBuffer): ArrayBuffer {
  return sign_detached(new Uint8Array(data), new Uint8Array(secretKey)).buffer;
}

export function verify(data: ArrayBuffer, signature: ArrayBuffer, publicKey: ArrayBuffer): boolean {
  return sign_detached_verify(new Uint8Array(data), new Uint8Array(signature), new Uint8Array(publicKey));
}

export function randomBytes(numberOfBytes: number): ArrayBuffer {
  const uint8Array = new Uint8Array(numberOfBytes);
  crypto.getRandomValues(uint8Array);
  return uint8Array.buffer;
}
