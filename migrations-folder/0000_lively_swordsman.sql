-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `Product` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`price` int NOT NULL,
	`category` enum('SKATEBOARD','CLOTHING','SHOES','ACCESSORIES') NOT NULL DEFAULT 'SKATEBOARD',
	`quantity` int NOT NULL DEFAULT 1,
	`inventory` int NOT NULL DEFAULT 1,
	`rating` int NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`storeId` varchar(191) NOT NULL);

CREATE TABLE `ProductImage` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`url` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`productId` varchar(191));

CREATE TABLE `Store` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL);

CREATE INDEX `Product_storeId_idx` ON `Product` (`storeId`);
CREATE INDEX `ProductImage_productId_idx` ON `ProductImage` (`productId`);
CREATE INDEX `Store_userId_idx` ON `Store` (`userId`);
*/