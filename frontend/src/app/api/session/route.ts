// app/api/session/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: session.user.id,
      firstName: session.user.firstName,
      email: session.user.email,
      role: session.user.role,
      interests : session.user.interests,
      profilePicture: session.user.profilePicture,
    },
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
  });
}
