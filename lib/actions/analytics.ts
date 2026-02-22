"use server";

import { mockDB } from "../db/mock-db";
import { getCurrentUser } from "./auth";
import { getStoreByVendor } from "./store";
import { startOfDay, subDays } from "date-fns";

export async function recordSale(
  storeId: string,
  totalAmount: number,
  items: Array<{ productId: string; quantity: number; unitPrice: number }>
) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify store ownership
  const storeResult = await getStoreByVendor();
  if (!storeResult.data || storeResult.data.id !== storeId) {
    return { error: "Unauthorized" };
  }

  // Calculate totals
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  // Create sale
  const sale = await mockDB.createSale({
    store_id: storeId,
    total_amount: total,
    items_count: itemsCount,
    status: "completed",
  });

  // Create sale items
  for (const item of items) {
    await mockDB.createSaleItem({
      sale_id: sale.id,
      vendor_product_id: item.productId,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.quantity * item.unitPrice,
    });
  }

  return { data: sale };
}

export async function getDailySalesMetrics(storeId: string, days: number = 30) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify store ownership
  const storeResult = await getStoreByVendor();
  if (!storeResult.data || storeResult.data.id !== storeId) {
    return { error: "Unauthorized" };
  }

  const startDate = subDays(new Date(), days);
  const sales = await mockDB.getSalesByStore(storeId, startDate);

  // Group by date
  const dailyMetrics = sales.reduce((acc: Array<{date: string; revenue: number; orders: number; items: number}>, sale) => {
    const date = new Date(sale.created_at).toISOString().split("T")[0];
    const existing = acc.find((m) => m.date === date);

    if (existing) {
      existing.revenue += sale.total_amount;
      existing.orders += 1;
      existing.items += sale.items_count;
    } else {
      acc.push({
        date,
        revenue: sale.total_amount,
        orders: 1,
        items: sale.items_count,
      });
    }

    return acc;
  }, []);

  return { data: dailyMetrics };
}

export async function getTodaysSalesMetrics(storeId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify store ownership
  const storeResult = await getStoreByVendor();
  if (!storeResult.data || storeResult.data.id !== storeId) {
    return { error: "Unauthorized" };
  }

  const today = startOfDay(new Date());
  const sales = await mockDB.getSalesByStore(storeId, today);

  const completedSales = sales.filter((s) => s.status === "completed");

  if (completedSales.length === 0) {
    return {
      data: {
        total_sales: 0,
        order_count: 0,
        average_order_value: 0,
      },
    };
  }

  const totalSales = completedSales.reduce(
    (sum, sale) => sum + sale.total_amount,
    0
  );
  const orderCount = completedSales.length;

  return {
    data: {
      total_sales: totalSales,
      order_count: orderCount,
      average_order_value: orderCount > 0 ? totalSales / orderCount : 0,
    },
  };
}

export async function getTotalRevenue(storeId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "User not authenticated" };
  }

  // Verify store ownership
  const storeResult = await getStoreByVendor();
  if (!storeResult.data || storeResult.data.id !== storeId) {
    return { error: "Unauthorized" };
  }

  const total = await mockDB.getTotalRevenue(storeId);

  return { data: total };
}
