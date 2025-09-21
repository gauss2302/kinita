import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserService } from "@/services/userService";
import { Suspense } from "react";
import { sessions } from "../../../auth-schema";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // const session = await auth.api.getSession({ headers: headers() });
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    redirect("/login");
  }

  const userData = await UserService.getUserById(session.user.id);

  return (
    <div className="p-6">
      <header className="mb-4">
        <h1 className="text-2xl">Dashboard</h1>
      </header>
      <Suspense fallback={<div>Loading user data...</div>}>
        <div>
          <p>Welcome, {userData.name}!</p>
          <p>Email: {userData.email}</p>
          <form action={logoutAction}>
            <button type="submit" className="mt-4 p-2 text-white bg-red-500">
              Logout
            </button>
          </form>
        </div>
      </Suspense>
    </div>
  );
}

async function logoutAction() {
  "use server";
  await auth.api.signOut({ headers: headers() });
  redirect("/login");
}
