ALTER TABLE `stores` MODIFY COLUMN `new_id` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `stores` ADD PRIMARY KEY(`new_id`);