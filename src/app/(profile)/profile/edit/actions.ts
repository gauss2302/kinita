"use server";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { UserService } from "@/services/userService";

export async function updateProfileAction(formData: FormData) {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || !session.user) {
    return { success: false, error: "Unauthorized" };
  }

  console.log("Session user ID in updateProfileAction:", session.user.id); // Debug log

  const data = {
    id: session.user.id,
    first_name: formData.get("first_name") as string,
    lastName: formData.get("lastName") as string,
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    bio: formData.get("bio") as string,
    linkedin: formData.get("linkedin") as string,
    github: formData.get("github") as string,
    location: formData.get("location") as string,
  };

  try {
    const updatedUser = await UserService.updateUser(data);
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("Update profile error:", error); // Debug log
    return {
      success: false,
      error: error.message || "Failed to update profile",
    };
  }
}

export async function getUserByIdAction() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session || !session.user) {
    throw new Error("Unauthorized");
  }

  console.log("Session user ID in getUserByIdAction:", session.user.id); // Debug log

  try {
    const user = await UserService.getUserById(session.user.id);
    return { success: true, user };
  } catch (error: any) {
    console.error("Get user error:", error);
    throw new Error(error.message || "Failed to fetch user");
  }
}
