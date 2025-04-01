import { env } from "@/env.js";
import type { SearchParams } from "@/types";
import type { Metadata } from "next";

import { AlertCard } from "@/components/alert-card";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { getProducts } from "@/lib/actions/product";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Products",
  description: "Buy products from our stores",
};

interface ProductsPageProps {
  searchParams: SearchParams;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const productsTransaction = await getProducts(searchParams);

  return (
    <Shell>
      <PageHeader>
        <PageHeaderHeading size="sm">Products</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <AlertCard />
    </Shell>
  );
}
