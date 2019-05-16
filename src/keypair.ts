interface HalfKeyPair {
  publicKey: ArrayBuffer;
}

type Keypair = HalfKeyPair & {
  secretKey: ArrayBuffer;
};
