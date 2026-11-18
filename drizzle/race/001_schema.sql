-- Minimal DDL mirroring src/db/schema (stores, addresses, products, orders) with the unique index added by this change.
CREATE TABLE stores (id text PRIMARY KEY);
CREATE TABLE addresses (id text PRIMARY KEY, line1 text);
CREATE TABLE products (id text PRIMARY KEY, inventory int NOT NULL);
CREATE TABLE orders (id text PRIMARY KEY, store_id text NOT NULL REFERENCES stores(id), quantity int, stripe_payment_intent_id text NOT NULL, address_id text NOT NULL REFERENCES addresses(id));
CREATE UNIQUE INDEX orders_stripe_payment_intent_id_unique ON orders (stripe_payment_intent_id);
