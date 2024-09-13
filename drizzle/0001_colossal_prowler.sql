DROP TABLE "user_messages";--> statement-breakpoint
DROP TABLE "users_pb_data";--> statement-breakpoint
ALTER TABLE "arrangers_pb_data" ADD COLUMN "avatar_url" text DEFAULT '/favicon.ico';--> statement-breakpoint
ALTER TABLE "arrangers_pb_data" ADD COLUMN "bio" text;--> statement-breakpoint
ALTER TABLE "arrangers_pb_data" ADD COLUMN "website" text;--> statement-breakpoint
ALTER TABLE "arrangers_pb_data" ADD COLUMN "social_links" text[];--> statement-breakpoint
ALTER TABLE "arrangers_pb_data" ADD COLUMN "genres" text[];--> statement-breakpoint
ALTER TABLE "arrangers_pb_data" ADD COLUMN "instruments" text[];