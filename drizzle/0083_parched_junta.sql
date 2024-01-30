ALTER TABLE `stores` ADD CONSTRAINT `stores_new_id_unique` UNIQUE(`new_id`);--> statement-breakpoint
ALTER TABLE `stores` ADD `new_id` varchar(128) NOT NULL;