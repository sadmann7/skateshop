ALTER TABLE `email_preferences` DROP CONSTRAINT `email_preferences_userId_unique`;--> statement-breakpoint
ALTER TABLE `email_preferences` DROP CONSTRAINT `email_preferences_email_unique`;--> statement-breakpoint
ALTER TABLE `email_preferences` DROP CONSTRAINT `email_preferences_token_unique`;--> statement-breakpoint
ALTER TABLE `payments` DROP CONSTRAINT `payments_userId_unique`;--> statement-breakpoint
ALTER TABLE `payments` DROP CONSTRAINT `payments_stripeAccountId_unique`;