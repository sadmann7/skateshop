import { type Metadata } from "next"

import { Header } from "@/components/header"
import { Shell } from "@/components/shell"

export const metadata: Metadata = {
  title: "Build a Board",
  description: "Select the components for your board",
}

export default function BuildABoadPage() {
  return (
    <Shell>
      <Header
        title="Build a Board"
        description="Select the components for your board"
      />
      <div className="mt-20 flex h-full w-full flex-col items-center justify-center">
        <h2 className="text-2xl font-bold">Under construction</h2>
        <p className="mt-1.5 text-muted-foreground">Please check back later</p>
      </div>
    </Shell>
  )
}
