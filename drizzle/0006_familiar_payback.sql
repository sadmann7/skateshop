CREATE TABLE `newsletter_subscriptions` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(191),
	`email` varchar(191) NOT NULL,
	`createdAt` timestamp DEFAULT (now()));
