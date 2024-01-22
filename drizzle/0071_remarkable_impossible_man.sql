ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `id` serial AUTO_INCREMENT;