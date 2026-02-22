"use server";

import { StoreCreateSchema, StoreUpdateSchema } from "@/lib/schemas";
import { mockDB } from "../db/mock-db";
import { getCurrentUser } from "./auth";

export async function createStore(data: unknown) {
  const validation = StoreCreateSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  // For demo purposes, use a default vendor_id if no user is logged in
  const user = await getCurrentUser();
  const vendorId = user?.id || "demo-vendor-" + Date.now();

  const store = await mockDB.createStore({
    vendor_id: vendorId,
    name: validation.data.name,
    contact_email: validation.data.contact_email,
    description: validation.data.description ?? null,
    phone: validation.data.phone ?? null,
    address: validation.data.address ?? null,
    city: validation.data.city ?? null,
    state: validation.data.state ?? null,
    postal_code: validation.data.postal_code ?? null,
    country: validation.data.country ?? null,
    logo_url: null,
    banner_url: null,
    latitude: null,
    longitude: null,
  });

  return { data: store };
}

export async function getStoreByVendor() {
  // For demo purposes, return the first store if no user is logged in
  const user = await getCurrentUser();
  
  if (!user) {
    // Return first available store for demo
    const allStores = await mockDB.getAllStores();
    return { data: allStores[0] || null };
  }

  const store = await mockDB.getStoreByVendor(user.id);

  return { data: store || null };
}

export async function updateStore(storeId: string, data: unknown) {
  const validation = StoreUpdateSchema.safeParse(data);

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify ownership
  const store = await mockDB.getStoreByVendor(user.id);

  if (!store || store.id !== storeId) {
    return { error: "Unauthorized" };
  }

  const updated = await mockDB.updateStore(storeId, validation.data);

  if (!updated) {
    return { error: "Store not found" };
  }

  return { data: updated };
}
