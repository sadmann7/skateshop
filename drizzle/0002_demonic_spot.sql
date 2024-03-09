ALTER TABLE "skateshop_categories" ADD COLUMN "slug" varchar(256);--> statement-breakpoint
ALTER TABLE "skateshop_subcategories" ADD COLUMN "slug" varchar(256);--> statement-breakpoint
ALTER TABLE "skateshop_categories" ADD CONSTRAINT "skateshop_categories_slug_unique" UNIQUE("slug");--> statement-breakpoint
ALTER TABLE "skateshop_subcategories" ADD CONSTRAINT "skateshop_subcategories_slug_unique" UNIQUE("slug");