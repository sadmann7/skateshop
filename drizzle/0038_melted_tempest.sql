ALTER TABLE `addresses` RENAME COLUMN `postalCode` TO `postal_code`;--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `paymentIntentId` TO `payment_intent_id`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `clientSecret` TO `client_secret`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `storeId` TO `store_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripePaymentIntentId` TO `stripe_payment_intent_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripePaymentIntentStatus` TO `stripe_payment_intent_status`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `addressId` TO `address_id`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripeAccountId` TO `stripe_account_id`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripeAccountCreatedAt` TO `stripe_account_created_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripeAccountExpiresAt` TO `stripe_account_expires_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `detailsSubmitted` TO `details_submitted`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `storeId` TO `store_id`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `stripeAccountId` TO `stripe_account_id`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `createdAt` TO `created_at`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `updatedAt` TO `updated_at`;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;