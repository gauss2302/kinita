import { db } from "@/db/client";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateUserSchema = z.object({
  id: z.string(),
  first_name: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  role: z
    .enum(["AI_ENGINEER", "RECRUITER", "RESEARCHER", "COMPANY_HR", "ADMIN"])
    .optional(),
  name: z.string().optional(),
  image: z.string().optional(),
});

export class UserService {
  static async getUserById(userId: string) {
    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          username: usersTable.username,
          first_name: usersTable.first_name,
          lastName: usersTable.lastName,
          role: usersTable.role,
          avatar: usersTable.avatar,
          image: usersTable.image,
          createdAt: usersTable.createdAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  static async updateUser(input: z.infer<typeof updateUserSchema>) {
    const validated = updateUserSchema.parse(input);
    try {
      const [updatedUser] = await db
        .update(usersTable)
        .set({
          first_name: validated.first_name,
          lastName: validated.lastName,
          username: validated.username,
          email: validated.email,
          role: validated.role,
          name: validated.name,
          image: validated.image,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, validated.id))
        .returning({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          username: usersTable.username,
          first_name: usersTable.first_name,
          lastName: usersTable.lastName,
          role: usersTable.role,
          image: usersTable.image,
        });

      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          name: usersTable.name,
          email: usersTable.email,
          username: usersTable.username,
          first_name: usersTable.first_name,
          lastName: usersTable.lastName,
          role: usersTable.role,
          image: usersTable.image,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      return user || null;
    } catch (error) {
      throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
  }
}
