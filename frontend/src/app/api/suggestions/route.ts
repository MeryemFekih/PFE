// app/api/suggestions/route.ts (frontend proxy)
'use server';

import { getSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_URL } from '@/lib/constants';

export async function GET(req: NextRequest) {
  const session = await getSession();

  if (!session?.user?.id || !session.user.interests) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/user/shared-interests`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    });

    const users = await res.json();
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching from backend:', error);
    return NextResponse.json([], { status: 500 });
  }
}
