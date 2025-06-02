// lib/session.ts
"use server";

import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role } from "@/lib/schemas";

export type Session = {
  user: {
    id: number;
    firstName: string;
    lastName?: string;
    email: string;
    role: Role;
    profilePicture?: any;
    interests: string[];
    university?: string;
    formation?: string;
    subject?: string;
  };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.SESSION_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

// ✅ SANITIZED session creation to include all fields (like interests)
export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const safePayload = JSON.parse(JSON.stringify(payload)); // ✅ remove undefined values

  const session = await new SignJWT(safePayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "none",
    path: "/",
  });
}

export async function getSession(): Promise<Session | null> {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

  try {
const { payload } = await jwtVerify(cookie, encodedKey, {
  algorithms: ["HS256"],
});

const typedPayload = payload as any as Session;
console.log("✅ FULL SESSION:", typedPayload);
console.log("✅ INTERESTS:", typedPayload.user.interests);

return typedPayload;
  } catch (err) {
    console.error("❌ Failed to verify the session", err);
    redirect("/auth/signIn");
  }
}

export async function deleteSession() {
  (await cookies()).delete("session");
}

export async function updateTokens({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;

const { payload } = await jwtVerify(cookie, encodedKey);
  if (!payload) throw new Error("Session not found");

  const typedPayload = payload as any as Session;
  const newPayload: Session = {
    user: { ...typedPayload.user },
    refreshToken,
    accessToken: ""
  };

  await createSession(newPayload);
}
