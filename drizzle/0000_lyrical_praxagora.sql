CREATE TYPE "public"."SERVER_FEATURE_FLAG" AS ENUM('All', 'Signup');--> statement-breakpoint
CREATE TABLE "server_feature_flags" (
	"id" varchar(32),
	"flag" "SERVER_FEATURE_FLAG"
);
--> statement-breakpoint
CREATE TABLE "servers" (
	"id" varchar(32) PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"server_id" varchar(32) NOT NULL,
	"username" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_server_id_servers_id_fk" FOREIGN KEY ("server_id") REFERENCES "public"."servers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_discord_id_server_id" ON "users" USING btree ("id","id");