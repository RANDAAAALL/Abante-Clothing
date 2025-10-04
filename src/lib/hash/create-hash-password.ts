import bcrypt from "bcryptjs";

// create hash password
export const hashPassword = async (p: string) => {return await bcrypt.hash(p, 10)}