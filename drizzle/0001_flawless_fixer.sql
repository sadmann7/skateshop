ALTER TABLE "skateshop_orders" DROP CONSTRAINT "skateshop_orders_store_id_skateshop_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "skateshop_payments" DROP CONSTRAINT "skateshop_payments_store_id_skateshop_stores_id_fk";
--> statement-breakpoint
ALTER TABLE "skateshop_products" DROP CONSTRAINT "skateshop_products_subcategory_id_skateshop_subcategories_id_fk";
--> statement-breakpoint
ALTER TABLE "skateshop_subcategories" DROP CONSTRAINT "skateshop_subcategories_category_id_skateshop_categories_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skateshop_orders" ADD CONSTRAINT "skateshop_orders_store_id_skateshop_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "skateshop_stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skateshop_payments" ADD CONSTRAINT "skateshop_payments_store_id_skateshop_stores_id_fk" FOREIGN KEY ("store_id") REFERENCES "skateshop_stores"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skateshop_products" ADD CONSTRAINT "skateshop_products_subcategory_id_skateshop_subcategories_id_fk" FOREIGN KEY ("subcategory_id") REFERENCES "skateshop_subcategories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skateshop_subcategories" ADD CONSTRAINT "skateshop_subcategories_category_id_skateshop_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "skateshop_categories"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
