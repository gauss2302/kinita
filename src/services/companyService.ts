/* eslint-disable @typescript-eslint/no-explicit-any */
import { db } from "@/db/client";
import { companiesTable } from "@/db/tables/companies";
import { eq } from "drizzle-orm";
import { z } from "zod";
import type { Company } from "@/db/tables/companies";

// Validation schema
const createCompanySchema = z.object({
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .optional(),
  logo: z.string().url("Invalid logo URL").optional().or(z.literal("")),
  website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  creatorId: z.string().min(1, "Creator ID is required"),
});

const updateCompanySchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z
    .string()
    .min(2, "Company name must be at least 2 characters")
    .max(255, "Company name must be less than 255 characters"),
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
  }): Promise<Company> {
    const validated = createCompanySchema.parse(data);

    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingCompany = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.name, validated.name))
      .limit(1);

    if (existingCompany.length > 0) {
      throw new Error("Company name already exists");
    }

    const existingSlug = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.slug, slug))
      .limit(1);

    const finalSlug = existingSlug.length > 0 ? `${slug}-${Date.now()}` : slug;

    const [company] = await db
      .insert(companiesTable)
      .values({
        id: crypto.randomUUID(),
        name: validated.name,
        slug: finalSlug,
        description: validated.description || null,
        logo: validated.logo || null,
        website: validated.website || null,
        creatorId: validated.creatorId,
        type: "STARTUP",
        size: "1_10",
        locations: [], // Initialize empty locations array
      })
      .returning();

    return company;
  }

  static async updateCompanyById(
    input: z.infer<typeof updateCompanySchema>
  ): Promise<Partial<Company>> {
    const validated = updateCompanySchema.parse(input);

    try {
      const [updatedCompany] = await db
        .update(companiesTable)
        .set({
          name: validated.name,
          description: validated.description || null,
          logo: validated.logo || null,
          website: validated.website || null,
          updatedAt: new Date(),
        })
        .where(eq(companiesTable.id, validated.id))
        .returning({
          id: companiesTable.id,
          name: companiesTable.name,
          description: companiesTable.description,
          logo: companiesTable.logo,
          website: companiesTable.website,
        });

      if (!updatedCompany) {
        throw new Error("Company not found");
      }

      return updatedCompany;
    } catch (error: any) {
      throw new Error(`Cannot update the company: ${error.message}`);
    }
  }

  static async getCompanyById(id: string): Promise<Company | null> {
    try {
      const [company] = await db
        .select()
        .from(companiesTable)
        .where(eq(companiesTable.id, id))
        .limit(1);

      return company || null;
    } catch (error: any) {
      throw new Error(`Failed to fetch company: ${error.message}`);
    }
  }
}
