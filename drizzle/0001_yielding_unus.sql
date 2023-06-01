CREATE TABLE `products` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`images` json,
	`category` enum('skateboard','clothing','shoes','accessories') NOT NULL DEFAULT 'skateboard',
	`price` int NOT NULL DEFAULT 0,
	`quantity` int NOT NULL DEFAULT 1,
	`inventory` int NOT NULL DEFAULT 1,
	`rating` int NOT NULL DEFAULT 0,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL,
	`storeId` varchar(191) NOT NULL);

CREATE TABLE `stores` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL);

DROP TABLE `Product`;
DROP TABLE `ProductImage`;
DROP TABLE `Store`;