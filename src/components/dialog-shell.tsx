"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { useDismiss } from "@/hooks/use-dismiss";
import { cn } from "@/lib/utils";

interface DialogShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DialogShell({
  children,
  className,
  ...props
}: DialogShellProps) {
  const router = useRouter();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        router.back();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [router]);

  useDismiss({
    refs: [containerRef],
    onDismiss: () => router.back(),
    enabled: true,
  });

  return (
    <div ref={containerRef} className={cn(className)} {...props}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4 size-auto shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:bg-transparent hover:opacity-100 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        onClick={() => router.back()}
      >
        <Cross2Icon className="size-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </Button>
      {children}
    </div>
  );
}
