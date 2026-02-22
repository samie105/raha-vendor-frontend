"use server";

import { mockDB } from "../db/mock-db";
import {
  VendorProductCreateSchema,
  VendorProductUpdateSchema,
} from "@/lib/schemas";
import { getCurrentUser } from "./auth";
import { getStoreByVendor } from "./store";

// ========== Global Product Actions ==========
export async function searchGlobalProducts(query: string) {
  const products = await mockDB.searchGlobalProducts(query);
  return { data: products };
}

export async function getGlobalProduct(id: string) {
  const product = await mockDB.getGlobalProduct(id);
  
  if (!product) {
    return { error: "Product not found" };
  }

  return { data: product };
}

// ========== Vendor Product Actions ==========
export async function addProductToStore(storeId: string, data: unknown) {
  const validation = VendorProductCreateSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify store ownership
  const storeResult = await getStoreByVendor();
  if (!storeResult.data) {
    return { error: "Unauthorized" };
  }

  if (storeResult.data.id !== storeId) {
    return { error: "Unauthorized" };
  }

  const approvalStatus = validation.data.global_product_id
    ? "approved"
    : "pending_review";

  const product = await mockDB.createVendorProduct({
    store_id: storeId,
    name: validation.data.name,
    local_price: validation.data.local_price,
    stock_count: validation.data.stock_count,
    description: validation.data.description ?? null,
    global_product_id: validation.data.global_product_id ?? null,
    cost_price: validation.data.cost_price ?? null,
    min_stock_level: validation.data.min_stock_level ?? 0,
    approval_status: approvalStatus,
    image_url: null,
    admin_notes: null,
  });

  return { data: product };
}

export async function getStoreProducts(storeId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify store ownership
  const storeResult = await getStoreByVendor();
  if (!storeResult.data) {
    return { error: "Unauthorized" };
  }

  if (storeResult.data.id !== storeId) {
    return { error: "Unauthorized" };
  }

  const products = await mockDB.getVendorProductsByStore(storeId);

  return { data: products };
}

export async function updateVendorProduct(productId: string, data: unknown) {
  const validation = VendorProductUpdateSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const updated = await mockDB.updateVendorProduct(productId, validation.data);

  if (!updated) {
    return { error: "Product not found" };
  }

  return { data: updated };
}

export async function deleteVendorProduct(productId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  const success = await mockDB.deleteVendorProduct(productId);

  if (!success) {
    return { error: "Product not found" };
  }

  return { data: { success: true } };
}

// ========== Admin Product Actions ==========
export async function getPendingProductReviews() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  const products = await mockDB.getPendingProductReviews();

  return { data: products };
}

export async function approveProduct(productId: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  const product = await mockDB.updateVendorProduct(productId, {
    approval_status: "approved",
  });

  if (!product) {
    return { error: "Product not found" };
  }

  return { data: product };
}

export async function rejectProduct(productId: string, notes: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return { error: "Unauthorized - Admin only" };
  }

  const product = await mockDB.updateVendorProduct(productId, {
    approval_status: "rejected",
    admin_notes: notes,
  });

  if (!product) {
    return { error: "Product not found" };
  }

  return { data: product };
}
