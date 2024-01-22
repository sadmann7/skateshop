CREATE TABLE `subscriptions` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(191) NOT NULL,
	`stripe_subscription_id` varchar(191),
	`stripe_price_id` varchar(191),
	`stripe_customer_id` varchar(191),
	`stripe_current_period_end` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscriptions_user_id_unique` UNIQUE(`user_id`)
);
