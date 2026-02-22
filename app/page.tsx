import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">R</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Raha</h1>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-8">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight text-foreground">
            Vendor Management Made Simple
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Manage your grocery store, track inventory, and monitor sales all in
            one place. Join thousands of vendors using Raha.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">Create Your Store</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <Card className="p-6 border-l-4 border-l-primary">
            <h3 className="font-semibold text-lg mb-3 text-foreground">Smart Product Directory</h3>
            <p className="text-muted-foreground">
              Search and auto-fill products from our centralized directory. No more
              manual data entry.
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-secondary">
            <h3 className="font-semibold text-lg mb-3 text-foreground">Inventory Management</h3>
            <p className="text-muted-foreground">
              Track stock levels, set pricing, and manage your entire inventory
              efficiently.
            </p>
          </Card>
          <Card className="p-6 border-l-4 border-l-accent">
            <h3 className="font-semibold text-lg mb-3 text-foreground">Sales Analytics</h3>
            <p className="text-muted-foreground">
              Real-time dashboards showing your sales, revenue, and customer trends.
            </p>
          </Card>
        </div>

        {/* How It Works */}
        <div className="mt-20 space-y-8">
          <h2 className="text-3xl font-bold text-center text-foreground">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="p-6 text-center relative">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-3">1</div>
              <h4 className="font-semibold mb-2 text-foreground">Sign Up</h4>
              <p className="text-sm text-muted-foreground">
                Create your vendor account
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-secondary text-primary flex items-center justify-center text-lg font-bold mb-3">2</div>
              <h4 className="font-semibold mb-2 text-foreground">Setup Store</h4>
              <p className="text-sm text-muted-foreground">
                Configure your store details
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-accent text-accent-foreground flex items-center justify-center text-lg font-bold mb-3">3</div>
              <h4 className="font-semibold mb-2 text-foreground">Add Products</h4>
              <p className="text-sm text-muted-foreground">
                Search or create products
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold mb-3">4</div>
              <h4 className="font-semibold mb-2 text-foreground">Track Sales</h4>
              <p className="text-sm text-muted-foreground">
                Monitor your performance
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-muted-foreground">
          <p>&copy; 2026 Raha. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}