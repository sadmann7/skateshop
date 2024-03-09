import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageHeader } from "@/components/page-header"
import { Shell } from "@/components/shell"

export default function EmailPreferencesLoading() {
  return (
    <Shell variant="centered">
      <PageHeader title="Email Preferences" className="text-center" />
      <Card>
        <CardHeader>
          <CardTitle>Email Preferences</CardTitle>
          <CardDescription>Manage your email preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex w-full flex-row items-center justify-between space-x-5 rounded-lg border p-4"
              >
                <div className="w-[90%] space-y-1.5">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-5 w-[10%]" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </Shell>
  )
}
