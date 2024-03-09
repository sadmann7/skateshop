import { type getStoresByUserId } from "@/lib/actions/store"
import { EmptyCard } from "@/components/cards/empty-card"
import { StoreCard } from "@/components/cards/store-card"

interface Stores {
  storesPromise: ReturnType<typeof getStoresByUserId>
}

export async function Stores({ storesPromise }: Stores) {
  const stores = await storesPromise

  return (
    <>
      {stores.length > 0 ? (
        stores.map((store) => (
          <StoreCard
            key={store.id}
            store={store}
            href={`/dashboard/stores/${store.id}`}
          />
        ))
      ) : (
        <EmptyCard
          icon="store"
          title="No stores found"
          description="Add a new store to manage your products"
          className="col-span-full"
        />
      )}
    </>
  )
}
