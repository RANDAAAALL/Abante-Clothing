import bcrypt from "bcryptjs";

// compare hashed password
export const isValidHashedPassword = async (p: string, h: string) => {return await bcrypt.compare(p, h)}