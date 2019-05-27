export interface HalfKeyPair {
  publicKey: ArrayBuffer;
}

export type Keypair = HalfKeyPair & {
  secretKey: ArrayBuffer;
};
