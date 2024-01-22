ALTER TABLE `stores` MODIFY COLUMN `id` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` DROP COLUMN `old_id`;