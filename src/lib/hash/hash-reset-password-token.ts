import crypto from "crypto";

export const hashedResetPasswordToken = (token: string) => {
    return crypto.createHash('sha256').update(token).digest('hex');
}