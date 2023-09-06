import { db } from "@/db"
import { products, stores } from "@/db/schema"
import { eq, isNotNull } from "drizzle-orm"
import { BotIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export async function ChatSheet() {
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      images: products.images,
      category: products.category,
      price: products.price,
      stripeAccountId: stores.stripeAccountId,
    })
    .from(products)
    .leftJoin(stores, eq(products.storeId, stores.id))
    .where(isNotNull(stores.stripeAccountId))
    .execute()

  console.log(allProducts)

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          aria-label="Open chat"
          size="icon"
          className="fixed bottom-4 right-4 rounded-full"
        >
          <BotIcon className="h-4 w-4" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-1">
          <SheetTitle>Chat</SheetTitle>
        </SheetHeader>
        <div className="pr-6">
          <Separator />
        </div>
      </SheetContent>
    </Sheet>
  )
}
