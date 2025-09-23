import RegisterCompanyForm from "@/components/company/RegisterCompanyForm";
import Header from "@/components/mainBlocks/header";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RegisterCompanyPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (session?.user) {
    redirect("/dashboard"); // Already logged in, redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-600 to-red-500">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <RegisterCompanyForm />
      </div>
    </div>
  );
}
