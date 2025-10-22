import { randomBytes } from "crypto";

export const generateCsrfToken = (): string => {
    return randomBytes(32).toString("hex");
}