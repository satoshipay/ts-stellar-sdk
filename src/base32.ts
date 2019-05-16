import base32 from "base32.js";

const VERSION_BYTES = {
  ed25519PublicKey: 6 << 3, // G
  ed25519SecretSeed: 18 << 3, // S
  preAuthTx: 19 << 3, // T
  sha256Hash: 23 << 3 // X
};

export type VersionByteNames = keyof typeof VERSION_BYTES;

function crc(byteArray: ArrayLike<number>): number {
  let crc = 0;
  const length = byteArray.length;

  for (let index = 0; index < length; index++) {
    const byte = byteArray[index];
    let code = (crc >>> 8) & 0xff;

    code ^= byte & 0xff;
    code ^= code >>> 4;
    crc = (crc << 8) & 0xffff;
    crc ^= code;
    code = (code << 5) & 0xffff;
    crc ^= code;
    code = (code << 7) & 0xffff;
    crc ^= code;
  }

  return crc;
}

export function isValid(versionByteName: VersionByteNames, encodedString: string) {
  if (encodedString.length !== 56) {
    return false;
  }

  try {
    const decoded = decode(versionByteName, encodedString);
    return decoded.byteLength === 32;
  } catch (err) {
    return false;
  }
}

export function decode(versionByteName: VersionByteNames, encodedString: string): ArrayBuffer {
  const decodedArray = base32.decode(encodedString);
  if (encodedString !== base32.encode(decodedArray)) {
    throw new Error("invalid encoded string");
  }

  const arrayLength = decodedArray.length;
  const crcValue = (decodedArray[arrayLength - 1] << 8) | decodedArray[arrayLength - 2];
  const expectedCrcValue = crc(decodedArray.slice(0, arrayLength - 2));
  if (crcValue !== expectedCrcValue) {
    throw new Error(`invalid checksum`);
  }

  const expectedVersion = VERSION_BYTES[versionByteName];
  if (decodedArray[0] !== expectedVersion) {
    throw new Error(`invalid version byte. expected ${expectedVersion}, got ${decodedArray[0]}`);
  }

  return new Uint8Array(decodedArray.slice(1, arrayLength - 2)).buffer;
}

export function encode(versionByteName: VersionByteNames, data: ArrayBuffer) {
  const dataArray = new Uint8Array(data);

  const unencodedArray = new Uint8Array(3 + data.byteLength);
  unencodedArray[0] = VERSION_BYTES[versionByteName];
  unencodedArray.set(dataArray, 1);

  const crcValue = crc(unencodedArray.slice(0, 1 + data.byteLength));
  unencodedArray[1 + data.byteLength] = crcValue & 0xff;
  unencodedArray[2 + data.byteLength] = crcValue >>> 8;

  return base32.encode(unencodedArray);
}
