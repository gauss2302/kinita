import { relations } from "drizzle-orm";
import {
  accountsTable,
  companiesTable,
  sessionsTable,
  usersTable,
} from "./schema";
import { jobSeekerProfilesTable } from "./tables/job-seeker-profiles";
import { companyMembersTable } from "./tables/company-members";
import { jobsTable } from "./tables/jobs";
import { applicationsTable } from "./tables/applications";
import { researchOpportunitiesTable } from "./tables/research-opportunities";

// User Relations
export const usersRelations = relations(usersTable, ({ one, many }) => ({
  // Profile relation (только для соискателей)
  jobSeekerProfile: one(jobSeekerProfilesTable, {
    fields: [usersTable.id],
    references: [jobSeekerProfilesTable.userId],
  }),

  // Company Relations
  createdCompanies: many(companiesTable, { relationName: "companyCreator" }),
  companyMemberships: many(companyMembersTable, { relationName: "memberUser" }),

  // Job Relations
  createdJobs: many(jobsTable, { relationName: "jobCreator" }),
  applications: many(applicationsTable, { relationName: "applicant" }),

  // Research Relations
  leadResearchOpportunities: many(researchOpportunitiesTable, {
    relationName: "researchLead",
  }),

  // Auth Relations
  sessions: many(sessionsTable, { relationName: "userSessions" }),
  accounts: many(accountsTable, { relationName: "userAccounts" }),
}));

// Job Seeker Profile Relations
export const jobSeekerProfilesRelations = relations(
  jobSeekerProfilesTable,
  ({ one }) => ({
    user: one(usersTable, {
      fields: [jobSeekerProfilesTable.userId],
      references: [usersTable.id],
    }),
  })
);

// Company Relations
export const companiesRelations = relations(
  companiesTable,
  ({ one, many }) => ({
    creator: one(usersTable, {
      fields: [companiesTable.creatorId],
      references: [usersTable.id],
      relationName: "companyCreator",
    }),
    members: many(companyMembersTable, { relationName: "companyMembers" }),
    jobs: many(jobsTable, { relationName: "companyJobs" }),
    researchOpportunities: many(researchOpportunitiesTable, {
      relationName: "organizationResearch",
    }),
  })
);

// Company Members Relations
export const companyMembersRelations = relations(
  companyMembersTable,
  ({ one }) => ({
    company: one(companiesTable, {
      fields: [companyMembersTable.companyId],
      references: [companiesTable.id],
      relationName: "companyMembers",
    }),
    user: one(usersTable, {
      fields: [companyMembersTable.userId],
      references: [usersTable.id],
      relationName: "memberUser",
    }),
    invitedByUser: one(usersTable, {
      fields: [companyMembersTable.invitedBy],
      references: [usersTable.id],
    }),
  })
);

// Jobs Relations
export const jobsRelations = relations(jobsTable, ({ one, many }) => ({
  company: one(companiesTable, {
    fields: [jobsTable.companyId],
    references: [companiesTable.id],
    relationName: "companyJobs",
  }),
  creator: one(usersTable, {
    fields: [jobsTable.createdBy],
    references: [usersTable.id],
    relationName: "jobCreator",
  }),
  applications: many(applicationsTable, { relationName: "jobApplications" }),
}));

// Applications Relations
export const applicationsRelations = relations(
  applicationsTable,
  ({ one }) => ({
    job: one(jobsTable, {
      fields: [applicationsTable.jobId],
      references: [jobsTable.id],
      relationName: "jobApplications",
    }),
    applicant: one(usersTable, {
      fields: [applicationsTable.applicantId],
      references: [usersTable.id],
      relationName: "applicant",
    }),
  })
);

// Research Opportunities Relations
export const researchOpportunitiesRelations = relations(
  researchOpportunitiesTable,
  ({ one }) => ({
    organization: one(companiesTable, {
      fields: [researchOpportunitiesTable.organizationId],
      references: [companiesTable.id],
      relationName: "organizationResearch",
    }),
    leadResearcher: one(usersTable, {
      fields: [researchOpportunitiesTable.leadResearcherId],
      references: [usersTable.id],
      relationName: "researchLead",
    }),
  })
);

// Auth Relations
export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
    relationName: "userSessions",
  }),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
    relationName: "userAccounts",
  }),
}));
