import { db } from "@/db";
import { products } from "@/db/schema";
import { env } from "@/env.js";
import { and, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories, getSubcategories } from "@/lib/actions/product";

import { UpdateProductForm } from "./components/update-product-form";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Manage Product",
  description: "Manage your product",
};

interface UpdateProductPageProps {
  params: {
    storeId: string;
    productId: string;
  };
}

export default async function UpdateProductPage({
  params,
}: UpdateProductPageProps) {
  const storeId = decodeURIComponent(params.storeId);
  const productId = decodeURIComponent(params.productId);

  const product = await db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.storeId, storeId)),
  });

  if (!product) {
    notFound();
  }

  const promises = Promise.all([getCategories(), getSubcategories()]).then(
    ([categories, subcategories]) => ({ categories, subcategories }),
  );

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Update product</CardTitle>
        <CardDescription>
          Update your product information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateProductForm promises={promises} product={product} />
      </CardContent>
    </Card>
  );
}
