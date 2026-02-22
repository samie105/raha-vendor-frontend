import { getPendingProductReviews } from "@/lib/actions/products";
import { AdminProductReview } from "@/components/admin-product-review";

export default async function AdminReviewPage() {
  const result = await getPendingProductReviews();
  const products = "data" in result ? result.data : [];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Product Review Panel</h1>
        <p className="text-muted-foreground">
          Review and approve pending vendor products
        </p>
      </div>

      <AdminProductReview products={products || []} />
    </div>
  );
}
