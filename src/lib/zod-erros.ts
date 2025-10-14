import { ZodError } from "zod";

export function getZodErrorMessages(error: ZodError): string[] {
  return error.issues.map((issue) => issue.message);
}
