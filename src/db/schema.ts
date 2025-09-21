export * from "./tables/user";
export * from "./tables/session";
export * from "./tables/companies";

import { usersTable } from "./tables/user";
import { sessionsTable } from "./tables/session";
import { companiesTable } from "./tables/companies";

export const schema = { usersTable, sessionsTable, companiesTable };
