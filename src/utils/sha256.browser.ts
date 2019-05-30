export async function sha256(data: ArrayBuffer): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", data);
}
