import LoginCompanyForm from "@/components/company/LoginCompanyForm";
import Header from "@/components/mainBlocks/header";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RegisterCompanyPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (session?.user) {
    // Fetch user to get companyId and role
    const { companyId, role } = session?.user;
    if (role === "ADMIN" && companyId) {
      redirect(`/dashboard/company/${companyId}`);
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-tl from-blue-600 to-red-500">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <LoginCompanyForm />
      </div>
    </div>
  );
}
