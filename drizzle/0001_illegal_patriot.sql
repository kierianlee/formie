ALTER TABLE "form" ADD COLUMN "recaptchaSecret" text;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "recaptchaEnabled" boolean DEFAULT false NOT NULL;