ALTER TABLE `addresses` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `id` TO `old_id`;--> statement-breakpoint
ALTER TABLE `addresses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `carts` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `email_preferences` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `orders` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `payments` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `products` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `addresses` ADD PRIMARY KEY(`old_id`);--> statement-breakpoint
ALTER TABLE `carts` ADD PRIMARY KEY(`old_id`);--> statement-breakpoint
ALTER TABLE `email_preferences` ADD PRIMARY KEY(`old_id`);--> statement-breakpoint
ALTER TABLE `orders` ADD PRIMARY KEY(`old_id`);--> statement-breakpoint
ALTER TABLE `payments` ADD PRIMARY KEY(`old_id`);--> statement-breakpoint
ALTER TABLE `products` ADD PRIMARY KEY(`old_id`);--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`old_id`);