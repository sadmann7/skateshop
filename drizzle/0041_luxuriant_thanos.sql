ALTER TABLE `addresses` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());