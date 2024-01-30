ALTER TABLE `stores` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`id`);