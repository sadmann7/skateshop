import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"

export default function CheckoutLoading() {
  return (
    <section className="relative flex flex-col items-start justify-center overflow-hidden lg:h-[100dvh] lg:flex-row">
      <div className="w-full space-y-12 py-8 lg:pt-16">
        <div className="fixed top-0 z-40 h-16 w-full bg-zinc-950 py-4 lg:static lg:top-auto lg:z-0 lg:h-0 lg:py-0">
          <div className="container flex max-w-xl items-center space-x-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
            <Skeleton className="h-6 w-28" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
        <div className="container max-w-xl space-y-2 lg:ml-auto lg:mr-0 lg:pr-[4.5rem]">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-8 w-32" />
        </div>
        <ScrollArea className="h-full">
          <div className="container flex max-h-[180px] w-full max-w-xl flex-col gap-5 lg:ml-auto lg:mr-0 lg:max-h-[580px] lg:pr-[4.5rem]">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex flex-col items-start justify-between gap-4 xs:flex-row">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded">
                      <div className="flex h-full items-center justify-center bg-secondary">
                        <Icons.placeholder
                          className="h-4 w-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-2 self-start text-sm">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="h-full w-full bg-white pb-12 pt-10 lg:pl-12 lg:pt-16">
        <div className="container min-h-[420px] max-w-xl lg:ml-0 lg:mr-auto">
          <div className="grid gap-5">
            {Array.from({ length: 4 }).map((_, j) => (
              <fieldset key={j} className="space-y-2">
                <Skeleton className="h-4 w-8 bg-muted/10" />
                <div className="flex h-11 items-center rounded border border-muted/10 bg-transparent px-3 py-1">
                  <Skeleton className="h-3.5 w-14 bg-muted/10" />
                </div>
              </fieldset>
            ))}
            <div className="flex flex-col items-center gap-2 xxs:flex-row">
              {Array.from({ length: 2 }).map((_, k) => (
                <fieldset key={k} className="w-full space-y-2">
                  <Skeleton className="h-4 w-8 bg-muted/10" />
                  <div className="flex h-11 items-center rounded border border-muted/10 bg-transparent px-3 py-1">
                    <Skeleton className="h-3.5 w-14 bg-muted/10" />
                  </div>
                </fieldset>
              ))}
            </div>
            <Skeleton className="h-8 w-full bg-muted/10" />
          </div>
        </div>
      </div>
    </section>
  )
}
