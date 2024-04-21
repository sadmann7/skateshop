ALTER TABLE "skateshop_notifications" RENAME COLUMN "newsletter" TO "receive_newsletter";--> statement-breakpoint
ALTER TABLE "skateshop_notifications" RENAME COLUMN "marketing" TO "receive_marketing";--> statement-breakpoint
ALTER TABLE "skateshop_notifications" DROP CONSTRAINT "skateshop_notifications_user_id_unique";--> statement-breakpoint
ALTER TABLE "skateshop_stores" DROP CONSTRAINT "skateshop_stores_user_id_unique";--> statement-breakpoint
ALTER TABLE "skateshop_subscriptions" DROP CONSTRAINT "skateshop_subscriptions_user_id_unique";--> statement-breakpoint
ALTER TABLE "skateshop_categories" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skateshop_subcategories" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "skateshop_notifications" ADD COLUMN "receive_communication" boolean DEFAULT false NOT NULL;