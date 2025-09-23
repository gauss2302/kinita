CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"image" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" varchar(100),
	"first_name" varchar(100),
	"last_name" varchar(100),
	"avatar" varchar(500),
	"bio" text,
	"role" varchar DEFAULT 'AI_ENGINEER' NOT NULL,
	"location" varchar(200),
	"timezone" varchar(100),
	"github_url" varchar(500),
	"linkedin_url" varchar(500),
	"personal_website" varchar(500),
	"is_active" boolean DEFAULT true,
	"last_login_at" timestamp,
	"company_id" text,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" varchar(45),
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
CREATE TABLE "companies" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(200) NOT NULL,
	"description" text,
	"website" varchar(500),
	"logo" varchar(500),
	"type" varchar DEFAULT 'STARTUP' NOT NULL,
	"size" varchar DEFAULT '1_10' NOT NULL,
	"founded_year" integer,
	"headquarters" varchar(200),
	"locations" jsonb,
	"linkedin_url" varchar(500),
	"twitter_url" varchar(500),
	"github_url" varchar(500),
	"employee_count" integer,
	"creator_id" text NOT NULL,
	"is_verified" boolean DEFAULT false,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "companies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "company_members" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" varchar DEFAULT 'EMPLOYEE' NOT NULL,
	"can_post_jobs" boolean DEFAULT false,
	"can_manage_applications" boolean DEFAULT false,
	"can_manage_members" boolean DEFAULT false,
	"invited_by" text,
	"invited_at" timestamp,
	"joined_at" timestamp DEFAULT now(),
	"left_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_seeker_profiles" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(200),
	"experience_level" varchar,
	"years_of_experience" integer,
	"remote_preference" boolean DEFAULT true,
	"relocation_willingness" boolean DEFAULT false,
	"preferred_employment_types" jsonb,
	"expected_salary_min" numeric(10, 2),
	"expected_salary_max" numeric(10, 2),
	"salary_currency" varchar(3) DEFAULT 'USD',
	"skills" jsonb,
	"education" jsonb,
	"work_experience" jsonb,
	"profile_visibility" varchar(20) DEFAULT 'PUBLIC',
	"job_alerts" boolean DEFAULT true,
	"ai_domains" jsonb,
	"research_interests" jsonb,
	"publications" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_seeker_profiles_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" text PRIMARY KEY NOT NULL,
	"company_id" text NOT NULL,
	"created_by" text NOT NULL,
	"title" varchar(300) NOT NULL,
	"slug" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"requirements" text,
	"responsibilities" text,
	"benefits" text,
	"experience_level" varchar NOT NULL,
	"employment_type" varchar NOT NULL,
	"location" varchar(200),
	"is_remote" boolean DEFAULT false,
	"visa_sponsorship" boolean DEFAULT false,
	"salary_min" numeric(10, 2),
	"salary_max" numeric(10, 2),
	"salary_currency" varchar(3) DEFAULT 'USD',
	"equity_offered" boolean DEFAULT false,
	"required_skills" jsonb,
	"preferred_skills" jsonb,
	"ai_domains" jsonb,
	"research_component" boolean DEFAULT false,
	"publications_required" boolean DEFAULT false,
	"status" varchar DEFAULT 'DRAFT' NOT NULL,
	"views_count" integer DEFAULT 0,
	"applications_count" integer DEFAULT 0,
	"application_deadline" timestamp,
	"start_date" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp,
	"closed_at" timestamp,
	CONSTRAINT "jobs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" text PRIMARY KEY NOT NULL,
	"job_id" text NOT NULL,
	"applicant_id" text NOT NULL,
	"cover_letter" text,
	"resume_url" varchar(500),
	"portfolio_url" varchar(500),
	"status" varchar DEFAULT 'PENDING' NOT NULL,
	"recruiter_notes" text,
	"interview_scheduled_at" timestamp,
	"interview_feedback" text,
	"technical_test_url" varchar(500),
	"technical_test_score" integer,
	"offer_salary" numeric(10, 2),
	"offer_currency" varchar(3),
	"offer_deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"responded_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "research_opportunities" (
	"id" text PRIMARY KEY NOT NULL,
	"organization_id" text,
	"lead_researcher_id" text NOT NULL,
	"title" varchar(300) NOT NULL,
	"description" text NOT NULL,
	"type" varchar NOT NULL,
	"research_areas" jsonb,
	"keywords" jsonb,
	"required_qualifications" text,
	"preferred_qualifications" text,
	"time_commitment" varchar(100),
	"duration" varchar(100),
	"is_funded" boolean DEFAULT false,
	"stipend" numeric(10, 2),
	"stipend_currency" varchar(3) DEFAULT 'USD',
	"location" varchar(200),
	"is_remote" boolean DEFAULT true,
	"status" varchar DEFAULT 'OPEN' NOT NULL,
	"application_deadline" timestamp,
	"start_date" timestamp,
	"end_date" timestamp,
	"publications_expected" boolean DEFAULT false,
	"conference_participation" boolean DEFAULT false,
	"mentorship_provided" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"published_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "company_members" ADD CONSTRAINT "company_members_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_seeker_profiles" ADD CONSTRAINT "job_seeker_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_applicant_id_users_id_fk" FOREIGN KEY ("applicant_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_opportunities" ADD CONSTRAINT "research_opportunities_organization_id_companies_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "research_opportunities" ADD CONSTRAINT "research_opportunities_lead_researcher_id_users_id_fk" FOREIGN KEY ("lead_researcher_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_company_id_idx" ON "users" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "companies_name_idx" ON "companies" USING btree ("name");--> statement-breakpoint
CREATE INDEX "companies_slug_idx" ON "companies" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "companies_type_idx" ON "companies" USING btree ("type");--> statement-breakpoint
CREATE INDEX "companies_creator_idx" ON "companies" USING btree ("creator_id");--> statement-breakpoint
CREATE INDEX "company_members_company_user_idx" ON "company_members" USING btree ("company_id","user_id");--> statement-breakpoint
CREATE INDEX "company_members_company_idx" ON "company_members" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "company_members_user_idx" ON "company_members" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "job_seeker_profiles_user_idx" ON "job_seeker_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "job_seeker_profiles_skills_idx" ON "job_seeker_profiles" USING gin ("skills");--> statement-breakpoint
CREATE INDEX "job_seeker_profiles_experience_idx" ON "job_seeker_profiles" USING btree ("experience_level");--> statement-breakpoint
CREATE INDEX "job_seeker_profiles_remote_idx" ON "job_seeker_profiles" USING btree ("remote_preference");--> statement-breakpoint
CREATE INDEX "jobs_company_idx" ON "jobs" USING btree ("company_id");--> statement-breakpoint
CREATE INDEX "jobs_creator_idx" ON "jobs" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "jobs_status_idx" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "jobs_skills_idx" ON "jobs" USING gin ("required_skills");--> statement-breakpoint
CREATE INDEX "jobs_published_idx" ON "jobs" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "applications_job_idx" ON "applications" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "applications_applicant_idx" ON "applications" USING btree ("applicant_id");--> statement-breakpoint
CREATE INDEX "applications_status_idx" ON "applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "applications_created_idx" ON "applications" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "research_type_idx" ON "research_opportunities" USING btree ("type");--> statement-breakpoint
CREATE INDEX "research_status_idx" ON "research_opportunities" USING btree ("status");--> statement-breakpoint
CREATE INDEX "research_areas_idx" ON "research_opportunities" USING gin ("research_areas");--> statement-breakpoint
CREATE INDEX "research_lead_idx" ON "research_opportunities" USING btree ("lead_researcher_id");