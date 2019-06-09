import { stringToBinary } from "./utils/utf8";

import { sha256 } from "./utils/sha.node";
import { PUBLIC_NETWORK_PASSPHRASE, TEST_NETWORK_PASSPHRASE } from "./config/config";

export type Network = {
  passphrase: string;
  id: ArrayBuffer;
};

export async function createFromPassphrase(passphrase: string): Promise<Network> {
  const id = await sha256(stringToBinary(passphrase));

  return {
    passphrase,
    id
  };
}

export async function createPublicNetwork(): Promise<Network> {
  return createFromPassphrase(PUBLIC_NETWORK_PASSPHRASE);
}

export async function createTestNetwork(): Promise<Network> {
  return createFromPassphrase(TEST_NETWORK_PASSPHRASE);
}
