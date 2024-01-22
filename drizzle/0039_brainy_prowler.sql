ALTER TABLE `payments` RENAME COLUMN `storeId` TO `store_id`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `store_id` TO `storeId`;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP;