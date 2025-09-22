"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  const headersList = await headers();
  await auth.api.signOut({ headers: headersList });
  redirect("/login");
}
