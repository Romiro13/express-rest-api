import { prisma } from "@/database/index.ts";
import { gerarToken } from "@/lib/jwt.ts";
import type { User, UserForCreate, UserForUpdate } from "@/models/user.ts";
import bcrypt from "bcrypt";

export async function createUser(user: UserForCreate) {
  return await prisma.user.create({ data: user });
}

export async function updateUser({ id, name, pwd }: UserForUpdate) {
  const user = await findOneById(id);

  if (!user) {
    throw new Error("Usuário não encontrado.");
  }

  return await prisma.user.update({
    where: { id },
    data: { name: name ?? user.name, pwd: pwd ?? user.pwd },
  });
}

export async function deleteUser(id: string) {
  return await prisma.user.delete({ where: { id } });
}

export async function findOneByEmail(user: User) {
  return await prisma.user.findUnique({ where: { email: user.email } });
}

export async function findOneById(id: string) {
  return await prisma.user.findUnique({ where: { id } });
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
  const _user = await findOneByEmail(user);

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
