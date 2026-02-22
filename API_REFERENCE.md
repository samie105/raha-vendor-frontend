# Raha API Reference - Server Actions

All business logic is implemented as **Next.js Server Actions**. These are type-safe, automatically secure, and work seamlessly with Server Components.

## Authentication API

### Location: `lib/actions/auth.ts`

#### Sign Up Vendor
```typescript
signUpVendor(email: string, password: string)
↳ Returns: { data: AuthUser } | { error: string | FieldErrors }
✓ Validates email format and password strength
✓ Hashes password via Supabase Auth
✓ Sets role to "vendor"
```

#### Sign Up Admin  
```typescript
signUpAdmin(email: string, password: string)
↳ Returns: { data: AuthUser } | { error: string | FieldErrors }
✓ Same as vendor but sets role to "admin"
```

#### Sign In
```typescript
signIn(email: string, password: string)
↳ Returns: { data: Session } | { error: string }
✓ Validates credentials
✓ Creates JWT session
✓ Sets secure cookies
```

#### Sign Out
```typescript
signOut()
↳ Returns: void (redirects to home)
✓ Clears session
✓ Removes cookies
```

#### Get Session
```typescript
getSession()
↳ Returns: Session | null
✓ Retrieves current user session
✓ Returns null if not authenticated
```

---

## Store Management API

### Location: `lib/actions/store.ts`

#### Create Store
```typescript
createStore(data: StoreCreate)
↳ Input: {
    name: string,
    description?: string,
    contact_email: string,
    phone?: string,
    address?: string,
    city?: string,
    state?: string,
    postal_code?: string,
    country?: string
  }
↳ Returns: { data: Store } | { error: string | FieldErrors }
✓ Validates input with Zod
✓ Associates with current vendor
✓ Stores address and contact info
```

#### Get Store by Vendor
```typescript
getStoreByVendor()
↳ Returns: { data: Store | null } | { error: string }
✓ Retrieves vendor's store
✓ Returns null if no store yet
✓ Requires authentication
```

#### Update Store
```typescript
updateStore(storeId: string, data: StoreUpdate)
↳ Input: Same as StoreCreate, plus optional logo_url, banner_url
↳ Returns: { data: Store } | { error: string | FieldErrors }
✓ Validates ownership
✓ Updates all fields
✓ Returns updated store
```

---

## Product Management API

### Location: `lib/actions/products.ts`

#### Search Global Products
```typescript
searchGlobalProducts(query: string)
↳ Returns: { data: GlobalProduct[] } | { error: string }
✓ Real-time search by name
✓ Returns max 10 results
✓ Only returns verified products
✓ No authentication required
```

#### Get Global Product
```typescript
getGlobalProduct(id: string)
↳ Returns: { data: GlobalProduct } | { error: string }
✓ Retrieves single global product
✓ Validates product is_verified
```

#### Add Product to Store
```typescript
addProductToStore(storeId: string, data: VendorProductCreate)
↳ Input: {
    name: string,
    description?: string,
    local_price: number,
    cost_price?: number,
    stock_count: number,
    min_stock_level?: number,
    global_product_id?: string
  }
↳ Returns: { data: VendorProduct } | { error: string | FieldErrors }
✓ Validates vendor ownership
✓ Auto-approves if global_product_id provided
✓ Sets to pending_review if manual entry
```

#### Get Store Products
```typescript
getStoreProducts(storeId: string)
↳ Returns: { data: VendorProduct[] } | { error: string }
✓ Lists all products in store
✓ Ordered by creation date
✓ Includes approval status
```

#### Update Vendor Product
```typescript
updateVendorProduct(productId: string, data: VendorProductUpdate)
↳ Input: Partial update fields
↳ Returns: { data: VendorProduct } | { error: string | FieldErrors }
✓ Validates ownership
✓ Updates price, stock, etc.
```

#### Delete Vendor Product
```typescript
deleteVendorProduct(productId: string)
↳ Returns: { data: { success: true } } | { error: string }
✓ Validates ownership
✓ Soft deletes or hard delete
```

---

## Admin Product Review API

### Location: `lib/actions/products.ts`

#### Get Pending Product Reviews
```typescript
getPendingProductReviews()
↳ Returns: { data: VendorProduct[] } | { error: string }
✓ Admin-only endpoint (checks role)
✓ Returns products with approval_status = "pending_review"
✓ Includes store info for context
```

#### Approve Product
```typescript
approveProduct(productId: string)
↳ Returns: { data: VendorProduct } | { error: string }
✓ Admin-only
✓ Sets approval_status to "approved"
✓ Makes product live in store
```

#### Reject Product
```typescript
rejectProduct(productId: string, notes: string)
↳ Returns: { data: VendorProduct } | { error: string }
✓ Admin-only
✓ Sets approval_status to "rejected"
✓ Stores admin notes for vendor
```

---

## Sales & Analytics API

### Location: `lib/actions/analytics.ts`

#### Record Sale
```typescript
recordSale(
  storeId: string,
  totalAmount: number,
  items: Array<{ productId: string, quantity: number, unitPrice: number }>
)
↳ Returns: { data: Sale } | { error: string }
✓ Validates vendor ownership
✓ Creates sale record
✓ Creates line items
✓ Updates metrics
```

#### Get Daily Sales Metrics
```typescript
getDailySalesMetrics(storeId: string, days: number = 30)
↳ Returns: { 
    data: DailySalesMetrics[]
  } | { error: string }
  
✓ Aggregates sales by day
✓ Calculates average order value
✓ Returns up to 30 days
✓ Ordered chronologically
```

Example Response:
```json
[
  {
    "date": "2026-01-28",
    "store_id": "uuid",
    "total_sales": 1500.50,
    "order_count": 12,
    "average_order_value": 125.04
  }
]
```

#### Get Today's Sales Metrics
```typescript
getTodaysSalesMetrics(storeId: string)
↳ Returns: {
    data: {
      total_sales: number,
      order_count: number,
      average_order_value: number
    }
  } | { error: string }
✓ Real-time metrics for current day
✓ Excludes previous days
```

#### Get Total Revenue
```typescript
getTotalRevenue(storeId: string)
↳ Returns: {
    data: { total_revenue: number }
  } | { error: string }
✓ Sum of all sales ever
✓ All-time metric
```

---

## Error Handling

All server actions follow consistent error handling:

```typescript
// Success response
{ data: <typed-data> }

// Field validation errors (Zod)
{
  error: {
    fieldName: ["error message"]
  }
}

// General error
{ error: "Error message string" }
```

---

## Usage Examples

### Example 1: Register & Create Store
```typescript
// Step 1: Sign up
const authResult = await signUpVendor("vendor@example.com", "Password123");
if ("error" in authResult) {
  console.error("Signup failed:", authResult.error);
  return;
}

// Step 2: Create store
const storeResult = await createStore({
  name: "Fresh Market",
  contact_email: "vendor@example.com",
  address: "123 Main St",
  city: "Springfield"
});

if ("error" in storeResult) {
  console.error("Store creation failed:", storeResult.error);
  return;
}

console.log("Store created:", storeResult.data);
```

### Example 2: Add Product from Directory
```typescript
// Step 1: Search products
const searchResult = await searchGlobalProducts("Coca-Cola");
const products = searchResult.data || [];

// Step 2: Get full product details
const productResult = await getGlobalProduct(products[0].id);
const product = productResult.data;

// Step 3: Add to store
const addResult = await addProductToStore(storeId, {
  global_product_id: product.id, // Links to directory
  local_price: 2.50,
  stock_count: 100
});

// auto-approved because it's from directory!
```

### Example 3: Manual Product Submission
```typescript
// This will be pending_review
const result = await addProductToStore(storeId, {
  name: "Custom Brand Juice",
  description: "Local organic juice",
  local_price: 5.99,
  stock_count: 50
  // No global_product_id = pending review
});

// Admin will see this in review panel
```

### Example 4: Admin Review Workflow
```typescript
// Get pending products
const pending = await getPendingProductReviews();

// Approve
await approveProduct(productId);

// Or reject with notes
await rejectProduct(productId, "Image quality too low, please resubmit");
```

### Example 5: View Sales Analytics
```typescript
// Today's metrics
const today = await getTodaysSalesMetrics(storeId);
console.log(`Today: $${today.data.total_sales}`);

// 30-day trends
const metrics = await getDailySalesMetrics(storeId, 30);
// Use for charting

// All-time revenue
const revenue = await getTotalRevenue(storeId);
```

---

## Security Notes

✅ **All actions validate:**
- User authentication
- Vendor/store ownership
- Admin role (for admin actions)
- Input data with Zod schemas

✅ **No sensitive data in URLs**
- All data passed via request body
- Automatic CSRF protection
- Secure cookies for sessions

✅ **Row-Level Security**
- Database also enforces permissions
- Defense in depth approach

---

## Calling from Client Components

```typescript
"use client";

import { addProductToStore } from "@/lib/actions/products";
import { useTransition } from "react";

export function AddProductButton() {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      const result = await addProductToStore(storeId, productData);
      if ("error" in result) {
        console.error(result.error);
      } else {
        console.log("Success:", result.data);
      }
    });
  };

  return (
    <button onClick={handleClick} disabled={isPending}>
      {isPending ? "Adding..." : "Add Product"}
    </button>
  );
}
```

---

## Database Transactions

For operations that modify multiple tables (like recordSale creating sale + sale_items), Supabase automatically wraps them in a transaction.

---

## Rate Limiting

Currently not implemented. For production, add:
- Rate limiting middleware
- Request logging
- Anomaly detection

---

**All actions are ready to integrate with your frontend components!** 🚀
