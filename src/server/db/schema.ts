import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  primaryKey,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";
import { nanoid } from "nanoid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `flowfolio_${name}`);

export const projects = createTable("project", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  name: varchar("name").notNull(),
  owner: varchar("owner", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, { fields: [projects.owner], references: [users.id] }),
  columns: many(columns),
}));

export type Project = typeof projects.$inferSelect;

export const columns = createTable("column", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  name: varchar("name").notNull(),
  projectId: varchar("projectId", { length: 255 })
    .notNull()
    .references(() => projects.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
});

export const columnsRelations = relations(columns, ({ one, many }) => ({
  project: one(projects, {
    fields: [columns.projectId],
    references: [projects.id],
  }),
  issues: many(issues),
}));

export type Column = typeof columns.$inferSelect;

export const statusEnum = pgEnum("status", ["done", "pending"]);

export const issues = createTable("issue", {
  id: varchar("id")
    .primaryKey()
    .$defaultFn(() => nanoid(10)),
  name: varchar("name").notNull(),
  columnId: varchar("columnId", { length: 255 })
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),
  status: statusEnum("status")
    .notNull()
    .$default(() => "pending"),
  assignedTo: varchar("assignedTo", { length: 255 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "string" }).notNull().defaultNow(),
  // .$default(() => "unassigned"),
});

export const issuesRelations = relations(issues, ({ one }) => ({
  column: one(columns, {
    fields: [issues.columnId],
    references: [columns.id],
  }),
  assignedTo: one(users, {
    fields: [issues.assignedTo],
    references: [users.id],
  }),
}));

export type Issue = typeof issues.$inferSelect;

export const users = createTable("user", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
  }).default(sql`CURRENT_TIMESTAMP`),
  image: text("image"),
  headerImage: varchar("headerImage"),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  assignedIssues: many(issues),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_userId_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("sessionToken", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("userId", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_userId_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verificationToken",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  }),
);
