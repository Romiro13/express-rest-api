import { prisma } from "@/database/index.ts";
import type { User } from "@/models/user.ts";

export async function createUser(user: User) {
  return await prisma.user.create({ data: user });
}
