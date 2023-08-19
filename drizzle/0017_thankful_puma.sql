ALTER TABLE `payments` MODIFY COLUMN `stripeAccountCreatedAt` int;--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `stripeAccountExpiresAt` int;--> statement-breakpoint
ALTER TABLE `email_preferences` ADD CONSTRAINT `email_preferences_userId_unique` UNIQUE(`userId`);--> statement-breakpoint
ALTER TABLE `email_preferences` ADD CONSTRAINT `email_preferences_email_unique` UNIQUE(`email`);--> statement-breakpoint
ALTER TABLE `email_preferences` ADD CONSTRAINT `email_preferences_token_unique` UNIQUE(`token`);--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_userId_unique` UNIQUE(`userId`);--> statement-breakpoint
ALTER TABLE `payments` ADD CONSTRAINT `payments_stripeAccountId_unique` UNIQUE(`stripeAccountId`);