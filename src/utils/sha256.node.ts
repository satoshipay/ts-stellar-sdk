import crypto from "crypto";

export async function sha256(data: ArrayBuffer): Promise<ArrayBuffer> {
  const hasher = crypto.createHash("sha256");
  hasher.update(Buffer.from(data));
  return hasher.digest().buffer;
}
