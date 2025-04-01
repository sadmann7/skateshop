import { db } from "@/db";
import { stores } from "@/db/schema";
import { env } from "@/env.js";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CartLineItems } from "@/components/checkout/cart-line-items";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutShell } from "@/components/checkout/checkout-shell";
import { Shell } from "@/components/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { getCart } from "@/lib/actions/cart";
import { createPaymentIntent, getStripeAccount } from "@/lib/actions/stripe";
import { cn, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Checkout",
  description: "Checkout with store items",
};

interface CheckoutPageProps {
  params: {
    storeId: string;
  };
}

export default async function CheckoutPage({ params }: CheckoutPageProps) {
  const storeId = decodeURIComponent(params.storeId);

  const store = await db
    .select({
      id: stores.id,
      name: stores.name,
      stripeAccountId: stores.stripeAccountId,
    })
    .from(stores)
    .where(eq(stores.id, storeId))
    .execute()
    .then((rows) => rows[0]);

  if (!store) {
    notFound();
  }

  const { isConnected } = await getStripeAccount({
    storeId,
  });

  const cartLineItems = await getCart({ storeId });

  const paymentIntentPromise = createPaymentIntent({
    storeId: store.id,
    items: cartLineItems,
  });

  const total = cartLineItems.reduce(
    (total, item) => total + Number(item.quantity) * Number(item.price),
    0,
  );

  if (!(isConnected && store.stripeAccountId)) {
    return (
      <Shell variant="centered">
        <div className="flex flex-col items-center justify-center gap-2 pt-20">
          <div className="text-center font-bold text-2xl">
            Store is not connected to Stripe
          </div>
          <div className="text-center text-muted-foreground">
            Store owner needs to connect their store to Stripe to accept
            payments
          </div>
          <Link
            aria-label="Back to cart"
            href="/cart"
            className={cn(
              buttonVariants({
                size: "sm",
              }),
            )}
          >
            Back to cart
          </Link>
        </div>
      </Shell>
    );
  }

  return (
    <section className="relative flex h-full min-h-dvh flex-col items-start justify-center lg:h-dvh lg:flex-row lg:overflow-hidden">
      <div className="w-full space-y-12 pt-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-[#09090b] py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center justify-between space-x-2 lg:mr-0 lg:ml-auto lg:pr-[4.5rem]">
            <Link
              aria-label="Back to cart"
              href="/cart"
              className="group flex w-28 items-center space-x-2 lg:flex-auto"
            >
              <ArrowLeftIcon
                className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
                aria-hidden="true"
              />
              <div className="block font-medium transition group-hover:hidden">
                Skateshop
              </div>
              <div className="hidden font-medium transition group-hover:block">
                Back
              </div>
            </Link>
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant="outline" size="sm">
                  Details
                </Button>
              </DrawerTrigger>
              <DrawerContent className="mx-auto flex h-[82%] w-full max-w-4xl flex-col space-y-6 border pt-8 pb-6">
                <CartLineItems
                  items={cartLineItems}
                  variant="minimal"
                  isEditable={false}
                  className="container h-full flex-1 pr-8"
                />
                <div className="container space-y-4 pr-8">
                  <Separator />
                  <div className="flex font-medium">
                    <div className="flex-1">
                      Total (
                      {cartLineItems.reduce(
                        (acc, item) => acc + Number(item.quantity),
                        0,
                      )}
                      )
                    </div>
                    <div>{formatPrice(total)}</div>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
        <div className="container flex max-w-xl flex-col items-center gap-1 lg:mr-0 lg:ml-auto lg:items-start lg:pr-[4.5rem]">
          <div className="line-clamp-1 font-semibold text-muted-foreground">
            Pay {store.name}
          </div>
          <div className="font-bold text-3xl">{formatPrice(total)}</div>
        </div>
        <CartLineItems
          items={cartLineItems}
          isEditable={false}
          className="container hidden w-full max-w-xl lg:mr-0 lg:ml-auto lg:flex lg:max-h-[580px] lg:pr-[4.5rem]"
        />
      </div>
      <CheckoutShell
        paymentIntentPromise={paymentIntentPromise}
        storeStripeAccountId={store.stripeAccountId}
        className="size-full flex-1 bg-white pt-10 pb-12 lg:flex-initial lg:pt-16 lg:pl-12"
      >
        <ScrollArea className="h-full">
          <CheckoutForm
            storeId={store.id}
            className="container max-w-xl pr-6 lg:mr-auto lg:ml-0"
          />
        </ScrollArea>
      </CheckoutShell>
    </section>
  );
}
