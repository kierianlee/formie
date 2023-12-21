CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT account_provider_providerAccountId_pk PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"redirectUrl" text NOT NULL,
	"recaptchaSecret" text,
	"recaptchaEnabled" boolean DEFAULT false NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "formsToTeams" (
	"form_id" text NOT NULL,
	"team_id" text NOT NULL,
	CONSTRAINT formsToTeams_form_id_team_id_pk PRIMARY KEY("form_id","team_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"formId" text NOT NULL,
	"fields" json NOT NULL,
	"date" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teamInvites" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"teamId" text NOT NULL,
	"invitedAt" timestamp NOT NULL,
	"invitedById" text NOT NULL,
	"respondedAt" timestamp,
	"accepted" boolean
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teamMembers" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"teamId" text NOT NULL,
	"inviteId" text,
	"role" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "teams" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdById" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT verificationToken_identifier_token_pk PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "form" ADD CONSTRAINT "form_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formsToTeams" ADD CONSTRAINT "formsToTeams_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "form"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "formsToTeams" ADD CONSTRAINT "formsToTeams_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submissions" ADD CONSTRAINT "submissions_formId_form_id_fk" FOREIGN KEY ("formId") REFERENCES "form"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamInvites" ADD CONSTRAINT "teamInvites_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamInvites" ADD CONSTRAINT "teamInvites_invitedById_user_id_fk" FOREIGN KEY ("invitedById") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_teamId_teams_id_fk" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teamMembers" ADD CONSTRAINT "teamMembers_inviteId_teamInvites_id_fk" FOREIGN KEY ("inviteId") REFERENCES "teamInvites"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "teams" ADD CONSTRAINT "teams_createdById_user_id_fk" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
