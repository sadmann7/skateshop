ALTER TABLE `addresses` RENAME COLUMN `postal_code` TO `postalCode`;--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `addresses` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `payment_intent_id` TO `paymentIntentId`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `client_secret` TO `clientSecret`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `carts` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `email_preferences` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `store_id` TO `storeId`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripe_payment_intent_id` TO `stripePaymentIntentId`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `stripe_payment_intent_status` TO `stripePaymentIntentStatus`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `address_id` TO `addressId`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `orders` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `store_id` TO `storeId`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripe_account_id` TO `stripeAccountId`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripe_account_created_at` TO `stripeAccountCreatedAt`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripe_account_expires_at` TO `stripeAccountExpiresAt`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `details_submitted` TO `detailsSubmitted`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `products` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `user_id` TO `userId`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `stripe_account_id` TO `stripeAccountId`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `created_at` TO `createdAt`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `updated_at` TO `updatedAt`;--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `createdAt` timestamp DEFAULT (now());