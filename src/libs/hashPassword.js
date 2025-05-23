import bcrypt from "bcryptjs";

export async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}