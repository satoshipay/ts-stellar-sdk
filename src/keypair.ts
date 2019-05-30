import { xdr } from "ts-stellar-xdr";

import { binaryToBase32, base32ToBinary } from "./utils/base32";
import { keyPairFromSeed, sign, verify, randomBytes } from "./utils/ed25519.node";
import { Network } from "./network";

export class PublicKey {
  public publicKey: ArrayBuffer;

  constructor(publicKey: ArrayBuffer) {
    if (publicKey.byteLength !== 32) {
      throw new Error("Invalid public key");
    }

    this.publicKey = publicKey;
  }

  static fromPublicString(publicString: string): PublicKey {
    const publicKey = base32ToBinary("ed25519PublicKey", publicString);
    return new this(publicKey);
  }

  getPublicKeyString() {
    return binaryToBase32("ed25519PublicKey", this.publicKey);
  }

  getSignatureHint(): ArrayBuffer {
    const accountIdXdr = xdr.AccountId.toXdr({
      type: "publicKeyTypeEd25519",
      value: this.publicKey
    });

    return accountIdXdr.slice(accountIdXdr.byteLength - 4);
  }

  verifySignature(data: ArrayBuffer, signature: ArrayBuffer): boolean {
    return verify(data, signature, this.publicKey);
  }
}

export class Keypair extends PublicKey {
  public secretKey: ArrayBuffer;
  public secretSeed: ArrayBuffer;

  constructor(secret: ArrayBuffer) {
    if (secret.byteLength !== 32) {
      throw new Error("Invalid secret");
    }

    const keypair = keyPairFromSeed(secret);

    super(keypair.publicKey);
    this.secretKey = keypair.secretKey;
    this.secretSeed = secret;
  }

  static fromSecretString(secretString: string): Keypair {
    const secret = base32ToBinary("ed25519SecretSeed", secretString);
    return new this(secret);
  }

  static createRandomKeypair(): Keypair {
    const randomSeed = randomBytes(32);
    return new this(randomSeed);
  }

  static createNetworkMasterKeyPair(network: Network): Keypair {
    return new this(network.id);
  }

  getSecretString() {
    return binaryToBase32("ed25519SecretSeed", this.secretSeed);
  }

  createSignature(data: ArrayBuffer): ArrayBuffer {
    return sign(data, this.secretKey);
  }
}
