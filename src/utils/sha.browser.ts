export async function sha256(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", data);
}

export async function sha512(data: Uint8Array): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-512", data);
}
