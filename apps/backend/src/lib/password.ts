import { argon2id, hash, verify, type Options } from "argon2";

const OPTIONS: Options = {
    type: argon2id,
    timeCost: 2,
    parallelism: 1,
    hashLength: 32,
    memoryCost: 32768
}

export async function hashPassword(password: string) {
    const result = await hash(password, OPTIONS);

    return result;
}

export async function verifyPassword(data: { password: string, hash: string }) {
    const { password, hash } = data;
    const result = await verify(hash, password, OPTIONS);

    return result;
}