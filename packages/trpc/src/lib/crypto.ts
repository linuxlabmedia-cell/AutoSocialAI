import { createDecipheriv } from "crypto";

const ALGORITHM = "aes-256-gcm";
const KEY = Buffer.from(process.env.ENCRYPTION_KEY ?? "00000000000000000000000000000000", "utf8").subarray(0, 32);

export function decrypt(data: string): string {
  const [ivHex, tagHex, encHex] = data.split(":");
  const decipher = createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex!, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex!, "hex"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encHex!, "hex")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}
