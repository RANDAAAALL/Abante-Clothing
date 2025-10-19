import crypto from "crypto";

export function generateResetPasswordToken() {
  return crypto.randomBytes(32).toString("hex");
}
