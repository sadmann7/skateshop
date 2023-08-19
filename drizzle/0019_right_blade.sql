ALTER TABLE `payments` MODIFY COLUMN `stripeAccountCreatedAt` timestamp;--> statement-breakpoint
ALTER TABLE `payments` MODIFY COLUMN `stripeAccountExpiresAt` timestamp;