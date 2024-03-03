CREATE TABLE `skateshop_addresses` (
	`id` varchar(128) NOT NULL,
	`line1` varchar(191),
	`line2` varchar(191),
	`city` varchar(191),
	`state` varchar(191),
	`postal_code` varchar(191),
	`country` varchar(191),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_carts` (
	`id` varchar(128) NOT NULL,
	`payment_intent_id` varchar(191),
	`client_secret` varchar(191),
	`items` json DEFAULT ('null'),
	`closed` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_carts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_notifications` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(255),
	`email` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`referred_by` varchar(191),
	`newsletter` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`transactional` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_notifications_id` PRIMARY KEY(`id`),
	CONSTRAINT `skateshop_notifications_email_unique` UNIQUE(`email`),
	CONSTRAINT `skateshop_notifications_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_orders` (
	`id` varchar(128) NOT NULL,
	`store_id` varchar(128) NOT NULL,
	`items` json DEFAULT ('null'),
	`quantity` int,
	`amount` decimal(10,2) NOT NULL DEFAULT '0',
	`stripe_payment_intent_id` varchar(255) NOT NULL,
	`stripe_payment_intent_status` varchar(255) NOT NULL,
	`name` varchar(191) NOT NULL,
	`email` varchar(191) NOT NULL,
	`address_id` int,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_payments` (
	`id` varchar(128) NOT NULL,
	`store_id` varchar(128) NOT NULL,
	`stripe_account_id` varchar(255) NOT NULL,
	`stripe_account_created_at` int,
	`stripe_account_expires_at` int,
	`details_submitted` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_products` (
	`id` varchar(128) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`images` json DEFAULT ('null'),
	`category` enum('skateboards','clothing','shoes','accessories') NOT NULL DEFAULT 'skateboards',
	`subcategory` varchar(191),
	`price` decimal(10,2) NOT NULL DEFAULT '0',
	`inventory` int NOT NULL DEFAULT 0,
	`rating` int NOT NULL DEFAULT 0,
	`tags` json DEFAULT ('null'),
	`store_id` varchar(128) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_stores` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`slug` text,
	`active` boolean NOT NULL DEFAULT false,
	`stripe_account_id` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skateshop_subscriptions` (
	`id` varchar(128) NOT NULL,
	`user_id` varchar(255) NOT NULL,
	`stripe_subscription_id` varchar(255),
	`stripe_price_id` varchar(255),
	`stripe_customer_id` varchar(255),
	`stripe_current_period_end` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skateshop_subscriptions_id` PRIMARY KEY(`id`),
	CONSTRAINT `skateshop_subscriptions_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE INDEX `store_idx` ON `skateshop_payments` (`store_id`);--> statement-breakpoint
CREATE INDEX `store_idx` ON `skateshop_products` (`store_id`);