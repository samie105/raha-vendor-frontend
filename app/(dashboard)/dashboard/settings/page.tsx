import { getStoreByVendor } from "@/lib/actions/store";
import { StoreSettingsForm } from "@/components/store-settings-form";

export default async function StoreSettingsPage() {
  const storeResult = await getStoreByVendor();
  const store = "data" in storeResult ? storeResult.data : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {store ? "Store Settings" : "Create Your Store"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {store
            ? "Manage your store information and contact details"
            : "Set up your store to start selling on Raha"}
        </p>
      </div>

      {/* Welcome Banner for New Stores */}
      {!store && (
        <div className="rounded-lg border bg-secondary/30 p-4">
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 shrink-0 rounded-lg bg-primary flex items-center justify-center text-white">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-medium text-foreground">
                Welcome to Raha!
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Complete the steps below to create your store and start selling.
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Quick setup
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Global products
                </span>
                <span className="flex items-center gap-1">
                  <svg className="h-3.5 w-3.5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Analytics
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Store Stats */}
      {store && (
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-3 py-1.5 text-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium text-foreground">Active</span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
            <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-muted-foreground">Created:</span>
            <span className="font-medium text-foreground">
              {new Date(store.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-sm">
            <span className="text-muted-foreground">ID:</span>
            <code className="font-mono text-foreground">{store.id.slice(0, 8)}</code>
          </div>
        </div>
      )}

      {/* Settings Form */}
      <StoreSettingsForm storeData={store} />
    </div>
  );
}
