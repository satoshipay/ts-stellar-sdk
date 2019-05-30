import { stringToBinary } from "./utils/utf8";

import { sha256 } from "./utils/sha256.node";

export type Network = {
  passphrase: string;
  networkId: ArrayBuffer;
};

export async function createFromPassphrase(passphrase: string) {
  const networkId = await sha256(stringToBinary(passphrase));

  return {
    passphrase,
    networkId
  };
}

export async function createPublicNetwork(): Promise<Network> {
  return createFromPassphrase("Public Global Stellar Network ; September 2015");
}

export async function createTestNetwork(): Promise<Network> {
  return createFromPassphrase("Test SDF Network ; September 2015");
}
