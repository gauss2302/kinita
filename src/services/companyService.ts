import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { companiesTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Database client
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

// Validation schema
const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  creatorId: z.string().uuid("Invalid creator ID"),
});

const updateCompanySchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(100, "Company name must be less than 100 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
});

export class CompanyService {
  static async createCompany(data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    creatorId: string;
  }) {
    // Validate input
    const validated = createCompanySchema.parse(data);

    // Check if company name already exists
    const existingCompany = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.name, validated.name))
      .limit(1);

    if (existingCompany.length > 0) {
      throw new Error("Company name already exists");
    }

    // Insert company
    const [company] = await db
      .insert(companiesTable)
      .values({
        name: validated.name,
        description: validated.description,
        logo: validated.logo,
        website: validated.website,
        creatorId: validated.creatorId,
      })
      .returning();

    return company;
  }

  static async updateCompanyById(input: z.infer<typeof updateCompanySchema>) {
    const validated = updateCompanySchema.parse(input);
    try {
      const [updatedCompany] = await db
        .update(companiesTable)
        .set({
          name: validated.name,
          description: validated.description,
          logo: validated.logo,
          website: validated.website,
        })
        .where(companiesTable.id == validated.id)
        .returning({
          id: companiesTable.id,
          name: companiesTable.name,
          description: companiesTable.description,
          logo: companiesTable.logo,
          website: companiesTable.website,
        });

      if (!updatedCompany) return "Not found";

      return updateCompanySchema;
    } catch (e) {
      throw new Error("Cannot update the company");
    }
  }

  static async getCompanyById(id: string) {
    const [company] = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, id))
      .limit(1);

    return company || null;
  }
}
