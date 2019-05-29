import { sign, randomBytes } from "tweetnacl";
import { xdr } from "ts-stellar-xdr";

import { binaryToBase32, base32ToBinary } from "./utils/base32";

export interface HalfKeypair {
  publicKey: ArrayBuffer;
}

export type Keypair = HalfKeypair & {
  secretKey: ArrayBuffer;
  secretSeed: ArrayBuffer;
};

export function getPublicKeyString(halfKeypair: HalfKeypair) {
  return binaryToBase32("ed25519PublicKey", halfKeypair.publicKey);
}

export function getSecretString(keypair: Keypair) {
  return binaryToBase32("ed25519SecretSeed", keypair.secretSeed);
}

export function keypairFromSecretString(secretString: string): Keypair {
  const secret = base32ToBinary("ed25519SecretSeed", secretString);
  return keypairFromSecret(secret);
}

export function keypairFromSecret(secret: ArrayBuffer): Keypair {
  if (secret.byteLength !== 32) {
    throw new Error("Invalid secret");
  }

  const tweetNaclKeypair = sign.keyPair.fromSeed(new Uint8Array(secret));

  return {
    publicKey: tweetNaclKeypair.publicKey.buffer,
    secretKey: tweetNaclKeypair.secretKey.buffer,
    secretSeed: secret
  };
}

export function halfKeypairFromPublicString(publicString: string): HalfKeypair {
  const publicKey = base32ToBinary("ed25519PublicKey", publicString);
  return halfKeypairFromPublic(publicKey);
}

export function halfKeypairFromPublic(publicKey: ArrayBuffer): HalfKeypair {
  if (publicKey.byteLength !== 32) {
    throw new Error("Invalid public key");
  }

  return { publicKey };
}

export function createRandomKeypair(): Keypair {
  const randomSeed = randomBytes(32);
  return keypairFromSecret(randomSeed.buffer);
}

export function getSignatureHint(halfKeypair: HalfKeypair) {
  const accountIdXdr = xdr.AccountId.toXdr({
    type: "publicKeyTypeEd25519",
    value: halfKeypair.publicKey
  });

  return accountIdXdr.slice(accountIdXdr.byteLength - 4);
}

export function createSignature(keypair: Keypair, data: ArrayBuffer): ArrayBuffer {
  return sign.detached(new Uint8Array(data), new Uint8Array(keypair.secretKey)).buffer;
}

export function verifySignature(halfKeypair: HalfKeypair, data: ArrayBuffer, signature: ArrayBuffer): boolean {
  return sign.detached.verify(new Uint8Array(data), new Uint8Array(signature), new Uint8Array(halfKeypair.publicKey));
}
