import { userSchema } from "@/models/user.ts";
import { createUser } from "@/services/user.ts";
import { Router } from "express";
import z from "zod";

export const userRouter: Router = Router();

userRouter.post("/", async (req, res) => {
  const user = await userSchema.safeParseAsync(req.body);

  if (!user.success) {
    return res
      .status(400)
      .json({ code: 400, message: "", errors: z.treeifyError(user.error) });
  }

  const _user = await createUser(user.data);

  return res.status(201).json(_user);
});
