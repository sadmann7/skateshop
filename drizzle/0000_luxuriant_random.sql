CREATE TABLE `products` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`images` json,
	`category` enum('skateboard','clothing','shoes','accessories') NOT NULL DEFAULT 'skateboard',
	`price` int NOT NULL DEFAULT 0,
	`quantity` int NOT NULL DEFAULT 1,
	`inventory` int NOT NULL DEFAULT 1,
	`rating` int NOT NULL DEFAULT 0,
	`storeId` int NOT NULL);

CREATE TABLE `stores` (
	`id` serial AUTO_INCREMENT PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`name` varchar(191) NOT NULL,
	`description` text,
	`slug` text);
