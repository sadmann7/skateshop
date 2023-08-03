CREATE TABLE `addresses` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`line1` varchar(191),
	`line2` varchar(191),
	`city` varchar(191),
	`state` varchar(191),
	`postalCode` varchar(191),
	`country` varchar(191),
	`createdAt` timestamp DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(191),
	`storeId` int NOT NULL,
	`items` json,
	`total` decimal(10,2) NOT NULL DEFAULT '0',
	`stripePaymentIntentId` varchar(191) NOT NULL,
	`stripePaymentIntentStatus` varchar(191) NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`addressId` int,
	`createdAt` timestamp DEFAULT (now()));
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(191),
	`storeId` int NOT NULL,
	`stripeAccountId` varchar(191) NOT NULL,
	`stripeAccountCreatedAt` int NOT NULL,
	`stripeAccountExpiresAt` int NOT NULL,
	`detailsSubmitted` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()));
