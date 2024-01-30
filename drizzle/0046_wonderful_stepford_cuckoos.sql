ALTER TABLE `payments` RENAME COLUMN `stripeAccountId` TO `stripe_account_id`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripeAccountCreatedAt` TO `stripe_account_created_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `stripeAccountExpiresAt` TO `stripe_account_expires_at`;--> statement-breakpoint
ALTER TABLE `payments` RENAME COLUMN `detailsSubmitted` TO `details_submitted`;