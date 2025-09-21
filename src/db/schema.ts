export * from "./tables/user";
export * from "./tables/session";
export * from "./tables/companies";
export * from "./tables/accounts";
export * from "./tables/verifications";

import { usersTable } from "./tables/user";
import { sessionsTable } from "./tables/session";
import { companiesTable } from "./tables/companies";
import { accountsTable } from "./tables/accounts";
import { verificationsTable } from "./tables/verifications";
export const schema = {
  usersTable,
  sessionsTable,
  companiesTable,
  accountsTable,
  verificationsTable,
};
