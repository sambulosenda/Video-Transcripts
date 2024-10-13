CREATE TABLE IF NOT EXISTS "trials" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"transcripts_used" integer DEFAULT 0 NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "trials_user_id_unique" UNIQUE("user_id")
);
