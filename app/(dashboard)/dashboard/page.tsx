import { getTodaysSalesMetrics, getTotalRevenue } from "@/lib/actions/analytics";
import { getStoreByVendor } from "@/lib/actions/store";
import { getStoreProducts } from "@/lib/actions/products";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function DashboardPage() {
  const storeResult = await getStoreByVendor();

  if ("error" in storeResult || !storeResult.data) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Welcome to Raha</h1>
            <p className="text-muted-foreground">
              Let&apos;s get started by setting up your store. It only takes a minute!
            </p>
          </div>
          <Link href="/dashboard/settings">
            <Button size="lg" className="w-full">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Setup Your Store
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const store = storeResult.data;
  const todayMetrics = await getTodaysSalesMetrics(store.id);
  const revenueResult = await getTotalRevenue(store.id);
  const productsResult = await getStoreProducts(store.id);

  const todayData = "data" in todayMetrics ? todayMetrics.data : null;
  const revenue = "data" in revenueResult ? revenueResult.data : 0;
  const products = "data" in productsResult ? productsResult.data : [];
  const approvedProducts = products?.filter((p: { approval_status: string }) => p.approval_status === "approved") || [];
  const pendingProducts = products?.filter((p: { approval_status: string }) => p.approval_status === "pending_review") || [];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Good morning! 👋
          </h1>
          <p className="text-muted-foreground">
            Here&apos;s what&apos;s happening with <span className="font-medium text-foreground">{store.name}</span> today
          </p>
        </div>
        <Link href="/dashboard/products/add">
          <Button className="w-full sm:w-auto">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Today's Sales */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Today&apos;s Sales</p>
              <p className="text-3xl font-bold text-foreground">
                ${todayData?.total_sales?.toFixed(2) || "0.00"}
              </p>
              <div className="flex items-center gap-1 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-primary font-medium">
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  12%
                </span>
                <span className="text-muted-foreground">vs yesterday</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Today's Orders */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Today&apos;s Orders</p>
              <p className="text-3xl font-bold text-foreground">
                {todayData?.order_count || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Avg: ${todayData?.average_order_value?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Total Revenue */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-3xl font-bold text-foreground">
                ${typeof revenue === 'number' ? revenue.toFixed(2) : "0.00"}
              </p>
              <p className="text-xs text-muted-foreground">All time earnings</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </Card>

        {/* Products */}
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Active Products</p>
              <p className="text-3xl font-bold text-foreground">
                {approvedProducts.length}
              </p>
              <p className="text-xs text-muted-foreground">
                {pendingProducts.length} pending review
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-2 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/dashboard/products/add" className="group">
                <div className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Add New Product</p>
                      <p className="text-sm text-muted-foreground">List a new item for sale</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/products" className="group">
                <div className="p-4 rounded-xl border border-border hover:border-secondary hover:bg-secondary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center group-hover:bg-secondary/80 transition-colors">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Manage Products</p>
                      <p className="text-sm text-muted-foreground">View and edit your catalog</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/analytics" className="group">
                <div className="p-4 rounded-xl border border-border hover:border-accent hover:bg-accent/5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">View Analytics</p>
                      <p className="text-sm text-muted-foreground">Track your performance</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link href="/dashboard/settings" className="group">
                <div className="p-4 rounded-xl border border-border hover:border-muted-foreground hover:bg-muted transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-muted/80 transition-colors">
                      <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">Store Settings</p>
                      <p className="text-sm text-muted-foreground">Update your profile</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </Card>

        {/* Recent Products */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Products</h2>
              <Link href="/dashboard/products" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>
            {products && products.length > 0 ? (
              <div className="space-y-3">
                {products.slice(0, 4).map((product: { id: string; name: string; local_price: number; approval_status: string; stock_count: number }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${product.local_price.toFixed(2)} • {product.stock_count} in stock
                      </p>
                    </div>
                    <Badge
                      variant={product.approval_status === "approved" ? "default" : "outline"}
                      className={product.approval_status === "approved" ? "bg-secondary text-primary border-secondary" : ""}
                    >
                      {product.approval_status === "approved" ? "Active" : "Pending"}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">No products yet</p>
                <Link href="/dashboard/products/add">
                  <Button variant="link" className="mt-2">
                    Add your first product
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
