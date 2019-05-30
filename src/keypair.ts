import { xdr } from "ts-stellar-xdr";

import { binaryToBase32, base32ToBinary } from "./utils/base32";
import { keyPairFromSeed, sign, verify, randomBytes } from "./utils/ed25519.node";

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

  const tweetNaclKeypair = keyPairFromSeed(secret);

  return {
    publicKey: tweetNaclKeypair.publicKey,
    secretKey: tweetNaclKeypair.secretKey,
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
  return keypairFromSecret(randomSeed);
}

export function getSignatureHint(halfKeypair: HalfKeypair) {
  const accountIdXdr = xdr.AccountId.toXdr({
    type: "publicKeyTypeEd25519",
    value: halfKeypair.publicKey
  });

  return accountIdXdr.slice(accountIdXdr.byteLength - 4);
}

export function createSignature(keypair: Keypair, data: ArrayBuffer): ArrayBuffer {
  return sign(data, keypair.secretKey);
}

export function verifySignature(halfKeypair: HalfKeypair, data: ArrayBuffer, signature: ArrayBuffer): boolean {
  return verify(data, signature, halfKeypair.publicKey);
}
