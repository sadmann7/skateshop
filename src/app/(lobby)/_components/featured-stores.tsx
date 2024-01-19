import { type FeaturedStoresPromise } from "@/lib/fetchers/store"
import { StoreCard } from "@/components/cards/store-card"

interface FeaturedStoresProps {
  storesPromise: FeaturedStoresPromise
}

export async function FeaturedStores({ storesPromise }: FeaturedStoresProps) {
  const stores = await storesPromise

  return (
    <>
      {stores.map((store) => (
        <StoreCard
          key={store.id}
          store={store}
          href={`/products?store_ids=${store.id}`}
        />
      ))}
    </>
  )
}
