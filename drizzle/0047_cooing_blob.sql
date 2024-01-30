ALTER TABLE `orders` RENAME COLUMN `storeId` TO `store_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripePaymentIntentId` TO `stripe_payment_intent_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripePaymentIntentStatus` TO `stripe_payment_intent_status`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `addressId` TO `address_id`;