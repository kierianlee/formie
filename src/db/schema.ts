import { relations } from "drizzle-orm";
import {
  integer,
  timestamp,
  pgTable,
  primaryKey,
  text,
  json,
  boolean,
} from "drizzle-orm/pg-core";
import { AdapterAccount } from "next-auth/adapters";

export const formsToTeams = pgTable(
  "formsToTeams",
  {
    formId: text("form_id")
      .notNull()
      .references(() => forms.id, { onDelete: "cascade" }),
    teamId: text("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
  },
  t => ({
    pk: primaryKey({ columns: [t.formId, t.teamId] }),
  }),
);
export const formsToTeamsRelations = relations(formsToTeams, ({ one }) => ({
  form: one(forms, {
    fields: [formsToTeams.formId],
    references: [forms.id],
  }),
  team: one(teams, {
    fields: [formsToTeams.teamId],
    references: [teams.id],
  }),
}));

export const forms = pgTable("form", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  redirectUrl: text("redirectUrl").notNull(),
  recaptchaSecret: text("recaptchaSecret"),
  recaptchaEnabled: boolean("recaptchaEnabled").notNull().default(false),
  name: text("name").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
export const formsRelations = relations(forms, ({ many }) => ({
  formsToTeams: many(formsToTeams),
}));

export const submissions = pgTable("submissions", {
  id: text("id").notNull().primaryKey(),
  formId: text("formId")
    .notNull()
    .references(() => forms.id, { onDelete: "cascade" }),
  fields: json("fields").$type<Record<string, any>>().notNull(),
  date: timestamp("date", { mode: "date" }).notNull(),
});
export const submissionsRelations = relations(submissions, ({ one }) => ({
  form: one(forms, { fields: [submissions.formId], references: [forms.id] }),
}));

export const teams = pgTable("teams", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  createdById: text("createdById")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow().notNull(),
});
export const teamsRelations = relations(teams, ({ many, one }) => ({
  formsToTeams: many(formsToTeams),
  members: many(teamMembers),
  invites: many(teamInvites),
  createdByUser: one(users, {
    fields: [teams.createdById],
    references: [users.id],
  }),
}));
export type Team = typeof teams.$inferSelect;

export const teamMembers = pgTable("teamMembers", {
  id: text("id").notNull().primaryKey(),
  userId: text("userId")
    .references(() => users.id)
    .notNull(),
  teamId: text("teamId")
    .references(() => teams.id, { onDelete: "cascade" })
    .notNull(),
  inviteId: text("inviteId").references(() => teamInvites.id),
  role: text("role").notNull(),
});
export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
    relationName: "user",
  }),
  invite: one(teamInvites, {
    fields: [teamMembers.inviteId],
    references: [teamInvites.id],
  }),
}));
export const TEAM_MEMBER_ROLES = {
  ADMIN: "ADMIN",
  MEMBER: "MEMBER",
} as const;

export type TeamMember = typeof teamMembers.$inferSelect;

export const teamInvites = pgTable("teamInvites", {
  id: text("id").notNull().primaryKey(),
  email: text("email").notNull(),
  teamId: text("teamId")
    .references(() => teams.id)
    .notNull(),
  invitedAt: timestamp("invitedAt", { mode: "date" }).notNull(),
  invitedById: text("invitedById")
    .references(() => users.id)
    .notNull(),
  respondedAt: timestamp("respondedAt", { mode: "date" }),
  accepted: boolean("accepted"),
});
export const teamInvitesRelations = relations(teamInvites, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvites.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [teamInvites.invitedById],
    references: [users.id],
    relationName: "invitedBy",
  }),
}));

/*
  NextAuth uses the below tables:
*/

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});
export const usersRelations = relations(users, ({ many, one }) => ({
  teams: many(teamMembers),
  forms: many(forms),
  teamInvites: many(teamInvites),
}));
export type User = typeof users.$inferSelect;

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  account => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);
export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  vt => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);
