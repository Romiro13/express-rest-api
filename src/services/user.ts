import { prisma } from "@/database/index.ts";
import { gerarToken } from "@/lib/jwt.ts";
import type { User } from "@/models/user.ts";
import bcrypt from "bcrypt";

export async function createUser(user: User) {
  return await prisma.user.create({ data: user });
}

export async function findOne(user: User) {
  return await prisma.user.findUnique({ where: { email: user.email } });
}

export async function findMany() {
  return await prisma.user.findMany({ take: 1000 });
}

export async function validatePwd(plainPwd: string, hashedPwd: string) {
  return await bcrypt.compare(plainPwd, hashedPwd);
}

export async function hashPwd(plainPwd: string) {
  return await bcrypt.hash(plainPwd, 10);
}

export async function login(user: User) {
  const _user = await findOne(user);

  if (!_user) {
    return null;
  }

  const isMatch = await validatePwd(user.pwd, _user.pwd);

  if (!isMatch) {
    return null;
  }

  const token = gerarToken({ sub: _user.id, name: _user.name });

  return token;
}
