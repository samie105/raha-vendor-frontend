import { getStoreByVendor } from "@/lib/actions/store";
import { AddProductForm } from "@/components/add-product-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card } from "@/components/ui/card";

export default async function AddProductPage() {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/dashboard/products" className="text-muted-foreground hover:text-foreground transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Add Product</h1>
          </div>
          <p className="text-muted-foreground">
            Search the global directory or create a custom product
          </p>
        </div>
        <Link href="/dashboard/products">
          <Button variant="outline" className="gap-2 w-full sm:w-auto">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            View All Products
          </Button>
        </Link>
      </div>

      {/* Info Card */}
      <Card className="overflow-hidden">
        <div className="bg-secondary/50 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">How it works</h3>
              <p className="text-sm text-muted-foreground">
                Search our global product directory to find products and add them to your store with your own pricing. 
                Products will be reviewed before going live. You can set your local price and stock count.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Product Form */}
      <AddProductForm storeId={store.id} />
    </div>
  );
}
