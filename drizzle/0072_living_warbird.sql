ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `stores` ADD `old_id` serial AUTO_INCREMENT;--> statement-breakpoint
ALTER TABLE `stores` DROP COLUMN `new_id`;