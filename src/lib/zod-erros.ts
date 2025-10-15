import z, { ZodError } from "zod";

export function getZodErrorMessages(error: ZodError): string[] {
  return z
    .prettifyError(error)
    .split("✖ ")
    .filter((v) => v !== "");
}
