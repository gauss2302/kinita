import { db } from "@/db/client";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateUserSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

export class UserService {
  static async getUserById(userId: string) {
    try {
      const [user] = await db
        .select({
          id: usersTable.id,
          name: usersTable.first_name,
          email: usersTable.email,
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
          first_name: validated.name,
          email: validated.email,
          updatedAt: new Date(),
        })
        .where(eq(usersTable.id, validated.id))
        .returning({
          id: usersTable.id,
          first_name: usersTable.first_name,
          email: usersTable.email,
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
          first_name: usersTable.first_name,
          email: usersTable.email,
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
