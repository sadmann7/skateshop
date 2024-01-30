ALTER TABLE `stores` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` DROP INDEX `stores_stripe_account_id_unique`;