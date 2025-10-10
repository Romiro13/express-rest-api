import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const _secret = process.env.JWT_SECRET || undefined;

if (!_secret) {
  throw new Error("Variável 'JWT_SECRET' não definida.");
}

const secret = new TextEncoder().encode(_secret);

export async function gerarToken(payload: JWTPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);
  return token;
}

export async function validarToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token inválido ou expirado:", err);
    return null;
  }
}
