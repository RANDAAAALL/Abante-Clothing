import { jwtVerify } from "jose";

export const verifyRefreshToken = async (token: string) => {
  return await jwtVerify(token, new TextEncoder().encode(process.env.JWT_REFRESH_SECRET));
};
