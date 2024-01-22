ALTER TABLE `stores` RENAME COLUMN `userId` TO `user_id`;--> statement-breakpoint
ALTER TABLE `stores` RENAME COLUMN `stripeAccountId` TO `stripe_account_id`;--> statement-breakpoint
ALTER TABLE `stores` ADD CONSTRAINT `stores_user_id_unique` UNIQUE(`user_id`);