import sha256 from "fast-sha256";
import { stringToBinary } from "./utils/utf8";

export type Network = {
  passphrase: string;
};

export const publicNetwork: Network = {
  passphrase: "Public Global Stellar Network ; September 2015"
};

export const testNetwork: Network = {
  passphrase: "Test SDF Network ; September 2015"
};

export function getNetworkId(network: Network): ArrayBuffer {
  return sha256(new Uint8Array(stringToBinary(network.passphrase))).buffer;
}
