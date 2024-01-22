ALTER TABLE `addresses` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `old_id` TO `id`;--> statement-breakpoint
ALTER TABLE `addresses` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `carts` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `email_preferences` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `orders` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `payments` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `products` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `stores` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `addresses` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `carts` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `email_preferences` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `orders` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `payments` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `products` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`id`);