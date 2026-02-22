import { z } from "zod";

// ========== Enums ==========
export const UserRoleSchema = z.enum(["admin", "vendor"]);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const ApprovalStatusSchema = z.enum([
  "pending_review",
  "approved",
  "rejected",
]);
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

// ========== User Schemas ==========
export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  password_hash: z.string(),
  role: UserRoleSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type User = z.infer<typeof UserSchema>;

export const UserCreateSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
});
export type UserCreate = z.infer<typeof UserCreateSchema>;

// ========== Store Schemas ==========
export const StoreSchema = z.object({
  id: z.string().uuid(),
  vendor_id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  logo_url: z.string().url().nullable(),
  banner_url: z.string().url().nullable(),
  contact_email: z.string().email(),
  phone: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  postal_code: z.string().nullable(),
  country: z.string().nullable(),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type Store = z.infer<typeof StoreSchema>;

export const StoreCreateSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  description: z.string().optional(),
  contact_email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
});
export type StoreCreate = z.infer<typeof StoreCreateSchema>;

export const StoreUpdateSchema = StoreCreateSchema.extend({
  logo_url: z.string().url().optional().nullable(),
  banner_url: z.string().url().optional().nullable(),
});
export type StoreUpdate = z.infer<typeof StoreUpdateSchema>;

// ========== Global Product Schemas ==========
export const GlobalProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  category_id: z.string().uuid(),
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  is_verified: z.boolean(),
  sku: z.string().nullable(),
  barcode: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type GlobalProduct = z.infer<typeof GlobalProductSchema>;

export const GlobalProductCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  category_id: z.string().uuid("Invalid category"),
  description: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
});
export type GlobalProductCreate = z.infer<typeof GlobalProductCreateSchema>;

// ========== Product Category Schemas ==========
export const ProductCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  icon_url: z.string().url().nullable(),
  created_at: z.string().datetime(),
});
export type ProductCategory = z.infer<typeof ProductCategorySchema>;

// ========== Vendor Product Schemas ==========
export const VendorProductSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid(),
  global_product_id: z.string().uuid().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  image_url: z.string().url().nullable(),
  local_price: z.number().positive(),
  cost_price: z.number().positive().nullable(),
  stock_count: z.number().int().nonnegative(),
  min_stock_level: z.number().int().nonnegative(),
  approval_status: ApprovalStatusSchema,
  admin_notes: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});
export type VendorProduct = z.infer<typeof VendorProductSchema>;

export const VendorProductCreateSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().optional(),
  local_price: z
    .number()
    .positive("Price must be greater than 0"),
  cost_price: z.number().optional(),
  stock_count: z
    .number()
    .int()
    .nonnegative("Stock cannot be negative"),
  min_stock_level: z.number().int().nonnegative().optional(),
  global_product_id: z.string().uuid().optional().nullable(),
});
export type VendorProductCreate = z.infer<typeof VendorProductCreateSchema>;

export const VendorProductUpdateSchema = VendorProductCreateSchema.partial({
  name: true,
  local_price: true,
  stock_count: true,
});
export type VendorProductUpdate = z.infer<typeof VendorProductUpdateSchema>;

// ========== Sale Schemas ==========
export const SaleSchema = z.object({
  id: z.string().uuid(),
  store_id: z.string().uuid(),
  total_amount: z.number().positive(),
  items_count: z.number().int().positive(),
  status: z.enum(["pending", "completed", "cancelled"]),
  created_at: z.string().datetime(),
});
export type Sale = z.infer<typeof SaleSchema>;

export const SaleItemSchema = z.object({
  id: z.string().uuid(),
  sale_id: z.string().uuid(),
  vendor_product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
  unit_price: z.number().positive(),
  subtotal: z.number().positive(),
});
export type SaleItem = z.infer<typeof SaleItemSchema>;

// ========== Analytics Schemas ==========
export const DailySalesMetricsSchema = z.object({
  date: z.string().date(),
  store_id: z.string().uuid(),
  total_sales: z.number().nonnegative(),
  order_count: z.number().int().nonnegative(),
  average_order_value: z.number().nonnegative(),
});
export type DailySalesMetrics = z.infer<typeof DailySalesMetricsSchema>;
