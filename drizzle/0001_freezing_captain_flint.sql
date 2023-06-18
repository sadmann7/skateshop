ALTER TABLE `products` MODIFY COLUMN `images` json DEFAULT ('null');
ALTER TABLE `products` ADD `tags` json DEFAULT ('null');
ALTER TABLE `products` ADD `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL;
ALTER TABLE `stores` ADD `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3) NOT NULL;