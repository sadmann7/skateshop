ALTER TABLE `carts` RENAME COLUMN `paymentIntentId` TO `payment_intent_id`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `clientSecret` TO `client_secret`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `storeId` TO `store_id`;