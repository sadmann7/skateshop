import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Icons } from "@/components/icons"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

export default function OrderSuccessLoading() {
  return (
    <div className="flex h-full max-h-[100dvh] w-full flex-col gap-10 overflow-hidden pb-8 pt-6 md:py-8">
      <div className="grid gap-10 overflow-auto">
        <PageHeader className="container flex max-w-7xl flex-col">
          <PageHeaderHeading>Thank you for your order</PageHeaderHeading>
          <PageHeaderDescription>
            Store will be in touch with you shortly
          </PageHeaderDescription>
        </PageHeader>
        <section className="flex flex-col space-y-6 overflow-auto">
          <ScrollArea className="h-full">
            <div className="container flex max-w-7xl flex-col gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
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
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-2 w-16" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Separator />
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="container flex max-w-7xl items-center justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </section>
        <Skeleton className="container h-4 w-20 max-w-7xl self-center" />
      </div>
    </div>
  )
}
