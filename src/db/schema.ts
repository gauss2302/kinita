// Export all table schemas
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

// Import tables
import { usersTable } from "./tables/users";
import { sessionsTable } from "./tables/sessions";
import { accountsTable } from "./tables/accounts";
import { verificationsTable } from "./tables/verifications";
import { companiesTable } from "./tables/companies";
import { companyMembersTable } from "./tables/company-members";
import { jobSeekerProfilesTable } from "./tables/job-seeker-profiles";
import { jobsTable } from "./tables/jobs";
import { applicationsTable } from "./tables/applications";
import { researchOpportunitiesTable } from "./tables/research-opportunities";

// Import relations
import {
  usersRelations,
  jobSeekerProfilesRelations,
  companiesRelations,
  companyMembersRelations,
  jobsRelations,
  applicationsRelations,
  researchOpportunitiesRelations,
  sessionsRelations,
  accountsRelations,
} from "./relations";

// Export relations
export {
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

// Combined schema for drizzle
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
