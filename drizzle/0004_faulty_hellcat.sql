ALTER TABLE `products` MODIFY COLUMN `price` decimal(10,2) NOT NULL DEFAULT '0';
ALTER TABLE `products` MODIFY COLUMN `inventory` int NOT NULL DEFAULT 0;
ALTER TABLE `products` ADD `subcategory` varchar(191);
ALTER TABLE `products` DROP COLUMN `subcategories`;