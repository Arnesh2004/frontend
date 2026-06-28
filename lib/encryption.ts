import CryptoJS from "crypto-js";

const SECRET_KEY = "secure-message-system-2026";

export function encryptMessage(message: string): string {
  return CryptoJS.AES.encrypt(message, SECRET_KEY).toString();
}

export function decryptMessage(cipher: string): string {
  const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}