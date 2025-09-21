import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  return NextResponse.json({ user: session.user });
}
