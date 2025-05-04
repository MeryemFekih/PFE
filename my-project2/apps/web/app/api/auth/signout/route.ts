// app/api/auth/signout/route.ts
import { deleteSession } from "@/lib/session";
import { NextResponse } from "next/server";

// export async function POST() {
//   try {
//     // Clear the session cookie immediately
//     await deleteSession();
    
//     return new NextResponse(JSON.stringify({ success: true }), {
//       status: 200,
//       headers: {
//         'Set-Cookie': `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
//         'Cache-Control': 'no-store, max-age=0'
//       }
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: 'Sign out failed' },
//       { status: 500 }
//     );
//   }
// }

import { authFetch } from "@/lib/authFetch";
import { BACKEND_URL } from "@/lib/constants";
import { redirect, RedirectType } from "next/navigation";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const respone = await authFetch(`${BACKEND_URL}/auth/signout`, {
    method: "POST",
  });
  if (respone.ok) { /* empty */ }
  await deleteSession();

  redirect("/", RedirectType.push);
}