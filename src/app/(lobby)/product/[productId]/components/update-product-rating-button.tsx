"use client";

import { HeartIcon } from "@radix-ui/react-icons";
import * as React from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { updateProductRating } from "@/lib/actions/product";
import { showErrorToast } from "@/lib/handle-error";
import { cn } from "@/lib/utils";

interface UpdateProductRatingButtonProps
  extends React.ComponentProps<typeof Button> {
  productId: string;
  rating: number;
}

export function UpdateProductRatingButton({
  productId,
  rating,
  className,
  ...props
}: UpdateProductRatingButtonProps) {
  const [loading, setLoading] = React.useState(false);

  return (
    <Button
      title="Favorite"
      variant="secondary"
      size="icon"
      className={cn("size-8 shrink-0", className)}
      onClick={async () => {
        setLoading(true);

        const { error } = await updateProductRating({
          id: productId,
          rating: rating + 1,
        });

        if (error) {
          showErrorToast(error);
          return;
        }

        toast.success("Product rating updated");
        setLoading(false);
      }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <Icons.spinner className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <HeartIcon className="size-4" aria-hidden="true" />
      )}
      <span className="sr-only">Favorite</span>
    </Button>
  );
}
