import * as tweetnacl from "tweetnacl";

export function keyPairFromSeed(seed: ArrayBuffer): { publicKey: ArrayBuffer; secretKey: ArrayBuffer } {
  const tweetNaclKeypair = tweetnacl.sign.keyPair.fromSeed(new Uint8Array(seed));

  return {
    publicKey: tweetNaclKeypair.publicKey.buffer,
    secretKey: tweetNaclKeypair.secretKey.buffer
  };
}

export function sign(data: ArrayBuffer, secretKey: ArrayBuffer): ArrayBuffer {
  return tweetnacl.sign.detached(new Uint8Array(data), new Uint8Array(secretKey)).buffer;
}

export function verify(data: ArrayBuffer, signature: ArrayBuffer, publicKey: ArrayBuffer): boolean {
  return tweetnacl.sign.detached.verify(new Uint8Array(data), new Uint8Array(signature), new Uint8Array(publicKey));
}

export function randomBytes(numberOfBytes: number): ArrayBuffer {
  return tweetnacl.randomBytes(numberOfBytes).buffer;
}
