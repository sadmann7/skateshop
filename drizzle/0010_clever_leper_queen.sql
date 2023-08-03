CREATE TABLE `email_preferences` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(191),
	`email` varchar(191) NOT NULL,
	`token` varchar(191) NOT NULL,
	`newsletter` boolean NOT NULL DEFAULT false,
	`marketing` boolean NOT NULL DEFAULT false,
	`transactional` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp DEFAULT (now()));
--> statement-breakpoint
DROP TABLE `newsletter_subscriptions`;