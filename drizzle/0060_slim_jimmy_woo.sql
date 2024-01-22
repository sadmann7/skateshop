ALTER TABLE `addresses` MODIFY COLUMN `line1` varchar(128);--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `line2` varchar(128);--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `city` varchar(128);--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `state` varchar(128);--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `postal_code` varchar(128);--> statement-breakpoint
ALTER TABLE `addresses` MODIFY COLUMN `country` varchar(128);--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `payment_intent_id` varchar(128);--> statement-breakpoint
ALTER TABLE `carts` MODIFY COLUMN `client_secret` varchar(128);--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `user_id` varchar(128);--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `email` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `email_preferences` MODIFY COLUMN `token` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `stripe_payment_intent_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `stripe_payment_intent_status` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `name` varchar(128);--> statement-breakpoint
ALTER TABLE `orders` MODIFY COLUMN `email` varchar(128);--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `stripe_account_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `name` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `subcategory` varchar(128);--> statement-breakpoint
ALTER TABLE `stores` MODIFY COLUMN `user_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `user_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_price_id` varchar(128);--> statement-breakpoint
ALTER TABLE `subscriptions` MODIFY COLUMN `stripe_customer_id` varchar(128);