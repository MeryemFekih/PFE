import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";

export default async function middleware(req: NextRequest) {
  const session = await getSession();
  if (!session || !session.user)
    return NextResponse.redirect(new URL("/auth/signIn", req.nextUrl));

  NextResponse.next();
}

export const config = {
  matcher: ["/profile"],
};