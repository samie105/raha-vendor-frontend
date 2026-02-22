import { getStoreByVendor } from "@/lib/actions/store";
import { getStoreProducts as getProducts } from "@/lib/actions/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  local_price: number;
  stock_count: number;
  approval_status: string;
}

export default async function ProductsPage() {
  const storeResult = await getStoreByVendor();

  if ("error" in storeResult || !storeResult.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Illustration */}
          <div className="relative">
            <div className="w-32 h-32 mx-auto rounded-full bg-muted flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-foreground">No Store Found</h2>
            <p className="text-muted-foreground">
              You need to set up your store before adding products
            </p>
          </div>

          <Link href="/dashboard/settings">
            <Button size="lg" className="gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Setup Your Store
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const store = storeResult.data;
  const productsResult = await getProducts(store.id);
  const products = "data" in productsResult ? productsResult.data ?? [] : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">
            Manage your store&apos;s inventory ({products?.length || 0} items)
          </p>
        </div>
        <Link href="/dashboard/products/add">
          <Button className="gap-2 w-full sm:w-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {!products || products.length === 0 ? (
        /* Empty State */
        <Card className="overflow-hidden">
          <div className="bg-muted p-8 sm:p-12">
            <div className="flex flex-col items-center text-center max-w-sm mx-auto space-y-6">
              {/* Illustration */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-secondary flex items-center justify-center">
                  <div className="w-24 h-24 rounded-xl bg-primary/10 flex items-center justify-center">
                    <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">No products yet</h3>
                <p className="text-muted-foreground text-sm">
                  Start by adding your first product from our global directory or create a custom one
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/products/add">
                  <Button className="gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add First Product
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        /* Products Grid */
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product: Product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-200">
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-muted flex items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center shadow-sm">
                  <svg className="w-10 h-10 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <Badge
                    variant={
                      product.approval_status === "approved"
                        ? "default"
                        : product.approval_status === "pending_review"
                          ? "secondary"
                          : "destructive"
                    }
                    className="text-xs"
                  >
                    {product.approval_status === "approved" && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {product.approval_status === "pending_review" && (
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {product.approval_status?.replace("_", " ")}
                  </Badge>
                </div>
                {/* Hover Edit Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Link href={`/dashboard/products/${product.id}/edit`}>
                    <Button variant="secondary" size="sm" className="gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {product.description || "No description"}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      ${product.local_price?.toFixed(2) || "0.00"}
                    </p>
                    <p className="text-xs text-muted-foreground">Price</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-foreground">
                      {product.stock_count || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">In Stock</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
