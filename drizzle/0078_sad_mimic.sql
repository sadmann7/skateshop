ALTER TABLE `stores` ADD CONSTRAINT `stores_user_id_unique` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `stores` DROP INDEX `stores_new_id_unique`;--> statement-breakpoint
ALTER TABLE `stores` DROP COLUMN `new_id`;