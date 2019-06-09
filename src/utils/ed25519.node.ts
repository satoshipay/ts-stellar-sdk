import sodium from "sodium-native";

export async function keyPairFromSeed(seed: ArrayBuffer): Promise<{ publicKey: ArrayBuffer; secretKey: ArrayBuffer }> {
  const publicKey = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES);
  const secretKey = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES);
  sodium.crypto_sign_seed_keypair(publicKey, secretKey, Buffer.from(seed));

  return {
    publicKey: publicKey.buffer,
    secretKey: secretKey.buffer
  };
}

export async function sign(data: ArrayBuffer, secretKey: ArrayBuffer): Promise<ArrayBuffer> {
  const signature = Buffer.alloc(sodium.crypto_sign_BYTES);
  sodium.crypto_sign_detached(signature, Buffer.from(data), Buffer.from(secretKey));
  return signature.buffer;
}

export async function verify(data: ArrayBuffer, signature: ArrayBuffer, publicKey: ArrayBuffer): Promise<boolean> {
  try {
    return sodium.crypto_sign_verify_detached(Buffer.from(signature), Buffer.from(data), Buffer.from(publicKey));
  } catch (_) {
    return false;
  }
}

export function randomBytes(numberOfBytes: number): ArrayBuffer {
  const buffer = Buffer.alloc(numberOfBytes);
  sodium.randombytes_buf(buffer);

  return buffer.buffer;
}
