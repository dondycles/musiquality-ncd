ALTER TABLE "library" DROP CONSTRAINT "library_payment_intent_transactions_payment_intent_id_fk";
--> statement-breakpoint
ALTER TABLE "sales" DROP CONSTRAINT "sales_payment_intent_transactions_payment_intent_id_fk";
