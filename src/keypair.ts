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

  async verifySignature(data: ArrayBuffer, signature: ArrayBuffer): Promise<boolean> {
    return verify(data, signature, this.publicKey);
  }
}

export class Keypair extends PublicKey {
  public secretKey!: ArrayBuffer;
  public secretSeed!: ArrayBuffer;

  private constructor(publicKey: ArrayBuffer) {
    super(publicKey);
  }

  static async create(secret: ArrayBuffer): Promise<Keypair> {
    if (secret.byteLength !== 32) {
      throw new Error("Invalid secret");
    }

    const ed25519Keypair = await keyPairFromSeed(secret);

    const keypair = new this(ed25519Keypair.publicKey);
    keypair.secretKey = ed25519Keypair.secretKey;
    keypair.secretSeed = secret;

    return keypair;
  }

  static async fromSecretString(secretString: string): Promise<Keypair> {
    const secret = base32ToBinary("ed25519SecretSeed", secretString);
    return this.create(secret);
  }

  static async createRandomKeypair(): Promise<Keypair> {
    const randomSeed = randomBytes(32);
    return this.create(randomSeed);
  }

  static async createNetworkMasterKeyPair(network: Network): Promise<Keypair> {
    return this.create(network.id);
  }

  getSecretString() {
    return binaryToBase32("ed25519SecretSeed", this.secretSeed);
  }

  async createSignature(data: ArrayBuffer): Promise<ArrayBuffer> {
    return sign(data, this.secretKey);
  }
}
