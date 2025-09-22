CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"username" varchar(100),
	"name" varchar(255),
	"image" varchar(500),
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100) NOT NULL,
	"avatar" varchar(500),
	"bio" text,
	"role" varchar NOT NULL,
	"title" varchar(200),
	"experience_level" varchar,
	"years_of_experience" integer,
	"location" varchar(200),
	"timezone" varchar(100),
	"remote_preference" boolean DEFAULT true,
	"relocation_willingness" boolean DEFAULT false,
	"expected_salary_min" numeric(10, 2),
	"expected_salary_max" numeric(10, 2),
	"salary_currency" varchar(3) DEFAULT 'USD',
	"skills" jsonb,
	"job_alerts" boolean DEFAULT true,
	"profile_visibility" varchar(20) DEFAULT 'PUBLIC',
	"github_url" varchar(500),
	"linkedin_url" varchar(500),
	"hugging_url" varchar(500),
	"twitter_url" varchar(500),
	"personal_website" varchar(500),
	"password_hash" varchar(255),
	"email_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text,
	"website" varchar(500),
	"type" varchar NOT NULL,
	"size" varchar NOT NULL,
	"founded_year" integer,
	"headquarters" varchar(200),
	"locations" jsonb,
	"logo" varchar(500),
	"linkedin_url" varchar(500),
	"twitter_url" varchar(500),
	"github_url" varchar(500),
	"hugging_face_url" varchar(500),
	"employee_count" integer,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_skills_idx" ON "users" USING gin ("skills");--> statement-breakpoint
CREATE INDEX "users_location_idx" ON "users" USING btree ("location");--> statement-breakpoint
CREATE INDEX "companies_name_idx" ON "companies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "companies_slug_idx" ON "companies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "companies_type_idx" ON "companies" USING btree ("type");--> statement-breakpoint
CREATE INDEX "companies_size_idx" ON "companies" USING btree ("size");