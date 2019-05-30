declare module "sodium-native" {
  const crypto_sign_PUBLICKEYBYTES: number;
  const crypto_sign_SECRETKEYBYTES: number;
  const crypto_sign_BYTES: number;

  function crypto_sign_seed_keypair(publicKey: Buffer, secretKey: Buffer, seed: Buffer): void;
  function crypto_sign_detached(signature: Buffer, data: Buffer, secretKey: Buffer): void;
  function crypto_sign_verify_detached(signature: Buffer, data: Buffer, publicKey: Buffer): boolean;

  function randombytes_buf(buffer: Buffer): void;
}
