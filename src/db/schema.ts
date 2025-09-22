import {
  accountsRelations,
  applicationsRelations,
  companiesRelations,
  companyMembersRelations,
  jobSeekerProfilesRelations,
  jobsRelations,
  researchOpportunitiesRelations,
  sessionsRelations,
  usersRelations,
} from "./relations";
import { accountsTable } from "./tables/accounts";
import { applicationsTable } from "./tables/applications";
import { companiesTable } from "./tables/companies";
import { companyMembersTable } from "./tables/company-members";
import { jobSeekerProfilesTable } from "./tables/job-seeker-profiles";
import { jobsTable } from "./tables/jobs";
import { researchOpportunitiesTable } from "./tables/research-opportunities";
import { sessionsTable } from "./tables/sessions";
import { usersTable } from "./tables/users";
import { verificationsTable } from "./tables/verifications";

export * from "./tables/users";
export * from "./tables/sessions";
export * from "./tables/accounts";
export * from "./tables/verifications";
export * from "./tables/companies";
export * from "./tables/company-members";
export * from "./tables/job-seeker-profiles";
export * from "./tables/jobs";
export * from "./tables/applications";
export * from "./tables/research-opportunities";

// Все relations импортируются из отдельного файла
export * from "./relations";

// Общая схема для drizzle
export const schema = {
  // Tables
  usersTable,
  sessionsTable,
  accountsTable,
  verificationsTable,
  companiesTable,
  companyMembersTable,
  jobSeekerProfilesTable,
  jobsTable,
  applicationsTable,
  researchOpportunitiesTable,

  // Relations
  usersRelations,
  jobSeekerProfilesRelations,
  companiesRelations,
  companyMembersRelations,
  jobsRelations,
  applicationsRelations,
  researchOpportunitiesRelations,
  sessionsRelations,
  accountsRelations,
};
