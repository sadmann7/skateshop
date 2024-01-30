ALTER TABLE `stores` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`old_id`);