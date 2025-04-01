"use client";

import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import * as React from "react";

import { Button } from "@/components/ui/button";

interface CopyButtonProps extends React.ComponentProps<typeof Button> {
  value: string;
}

export function CopyButton({ value, ...props }: CopyButtonProps) {
  const [isCopied, setIsCopied] = React.useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      className="absolute top-4 right-5 z-20 size-6 px-0"
      onClick={() => {
        if (typeof window === "undefined") return;
        setIsCopied(true);
        void window.navigator.clipboard.writeText(value?.toString() ?? "");
        setTimeout(() => setIsCopied(false), 2000);
      }}
      {...props}
    >
      {isCopied ? (
        <CheckIcon className="size-3" aria-hidden="true" />
      ) : (
        <CopyIcon className="size-3" aria-hidden="true" />
      )}
      <span className="sr-only">
        {isCopied ? "Copied" : "Copy to clipboard"}
      </span>
    </Button>
  );
}
