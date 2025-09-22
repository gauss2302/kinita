import { db } from "@/db/client";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const updateUserSchema = z.object({
  id: z.string().min(1, "ID is required"), // Changed from z.string().uuid()
  first_name: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email address").optional(),
  role: z
    .enum(["AI_ENGINEER", "RECRUITER", "RESEARCHER", "COMPANY_HR", "ADMIN"])
    .optional(),
  name: z.string().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be less than 500 characters")
    .optional()
    .or(z.literal("")),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  location: z
    .string()
    .max(100, "Location must be less than 100 characters")
    .optional()
    .or(z.literal("")),
});

// Schema for creating admin user
const createAdminUserSchema = z.object({
  email: z.string().email("Invalid email address").min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
  first_name: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .optional(),
  companyId: z.string().min(1, "Company ID is required"),
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
          bio: usersTable.bio,
          linkedin: usersTable.linkedinUrl,
          github: usersTable.githubUrl,
          location: usersTable.location,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        })
        .from(usersTable)
        .where(eq(usersTable.id, userId))
        .limit(1);

      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error: any) {
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
          bio: validated.bio,
          linkedinUrl: validated.linkedin,
          githubUrl: validated.github,
          location: validated.location,
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
          bio: usersTable.bio,
          linkedin: usersTable.linkedinUrl,
          github: usersTable.githubUrl,
          location: usersTable.location,
          createdAt: usersTable.createdAt,
          updatedAt: usersTable.updatedAt,
        });

      if (!updatedUser) {
        throw new Error("User not found");
      }
      return updatedUser;
    } catch (error: any) {
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
          bio: usersTable.bio,
          linkedin: usersTable.linkedinUrl,
          github: usersTable.githubUrl,
          location: usersTable.location,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit(1);

      return user || null;
    } catch (error: any) {
      throw new Error(`Failed to fetch user by email: ${error.message}`);
    }
  }

  static async createAdminUserForCompany(
    input: z.infer<typeof createAdminUserSchema>
  ) {
    const validated = createAdminUserSchema.parse(input);

    try {
      // Check for duplicate email
      const existingUser = await db
        .select({ id: usersTable.id })
        .from(usersTable)
        .where(eq(usersTable.email, validated.email))
        .limit(1);
      if (existingUser.length > 0) {
        throw new Error("Email already in use");
      }

      // Check for duplicate username if provided
      if (validated.username) {
        const existingUsername = await db
          .select({ id: usersTable.id })
          .from(usersTable)
          .where(eq(usersTable.username, validated.username))
          .limit(1);
        if (existingUsername.length > 0) {
          throw new Error("Username already taken");
        }
      }

      // Insert user
      const [newUser] = await db
        .insert(usersTable)
        .values({
          id: crypto.randomUUID(), // Or your ID generator for 32-char string
          email: validated.email,
          first_name: validated.first_name,
          lastName: validated.lastName,
          username: validated.username,
          role: "ADMIN" as const,
          name: `${validated.first_name} ${validated.lastName}`,
          companyId: validated.companyId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

      if (!newUser) {
        throw new Error("Failed to create admin user");
      }

      return newUser;
    } catch (error: any) {
      throw new Error(`Failed to create admin user: ${error.message}`);
    }
  }
}
