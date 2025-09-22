import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserService } from "@/services/userService";
import Header from "@/components/mainBlocks/header";
import EditProfileForm from "@/components/profile/EditProfileForm";

export const dynamic = "force-dynamic";

export default async function EditProfilePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session?.user) {
    redirect("/login");
  }

  let userData;
  try {
    console.log("Session user ID:", session.user.id); // Debug log
    userData = await UserService.getUserById(session.user.id);
  } catch (error: any) {
    console.error("Error fetching user data:", error);
    userData = {
      id: session.user.id,
      name: session.user.name || "User",
      email: session.user.email || "No email",
      first_name: session.user.first_name || "",
      lastName: session.user.lastName || "",
      username: session.user.username || "",
      role: session.user.role || "Unknown",
      image: session.user.image || null,
      avatar: session.user.avatar || null,
      bio: "",
      linkedin: "",
      github: "",
      location: "",
      createdAt: new Date(),
    };
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header user={userData} />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <EditProfileForm userData={userData} />
      </div>
    </div>
  );
}
