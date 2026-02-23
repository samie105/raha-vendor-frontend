import { z } from 'zod';
import {
  UserSchema,
  StoreSchema,
  GlobalProductSchema,
  VendorProductSchema,
  SaleSchema,
  SaleItemSchema,
} from '../schemas';

// Types
type User = z.infer<typeof UserSchema>;
type Store = z.infer<typeof StoreSchema>;
type GlobalProduct = z.infer<typeof GlobalProductSchema>;
type VendorProduct = z.infer<typeof VendorProductSchema>;
type Sale = z.infer<typeof SaleSchema>;
type SaleItem = z.infer<typeof SaleItemSchema>;

// In-memory storage
const db = {
  users: [] as User[],
  stores: [] as Store[],
  globalProducts: [] as GlobalProduct[],
  vendorProducts: [] as VendorProduct[],
  sales: [] as Sale[],
  saleItems: [] as SaleItem[],
  sessions: new Map<string, { userId: string; email: string; role: string }>(),
};

// Seed data
const seedGlobalProducts: GlobalProduct[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    category_id: 'electronics',
    description: 'Latest Apple flagship smartphone with A17 Pro chip',
    image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569',
    sku: 'APPL-IP15P',
    barcode: '1234567890123',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24',
    category_id: 'electronics',
    description: 'Premium Android smartphone with AI features',
    image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c',
    sku: 'SAMS-GS24',
    barcode: '1234567890124',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5',
    category_id: 'electronics',
    description: 'Industry-leading noise canceling headphones',
    image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b',
    sku: 'SONY-WH1000XM5',
    barcode: '1234567890125',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'MacBook Pro 14" M3',
    category_id: 'electronics',
    description: 'Professional laptop with M3 chip',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    sku: 'APPL-MBP14M3',
    barcode: '1234567890126',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'iPad Air',
    category_id: 'electronics',
    description: 'Versatile tablet with M1 chip',
    image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    sku: 'APPL-IPADA',
    barcode: '1234567890127',
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

db.globalProducts = [...seedGlobalProducts];

// Helper functions
function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function generateSessionToken(): string {
  return Math.random().toString(36).substr(2, 20);
}

export const mockDB = {
  // Users
  async createUser(data: { email: string; password: string; role: "admin" | "vendor" }) {
    const user: User = {
      id: generateId(),
      email: data.email,
      password_hash: data.password,
      role: data.role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.users.push(user);
    return user;
  },

  async getUserByEmail(email: string) {
    return db.users.find((u) => u.email === email) || null;
  },

  async getUserById(id: string) {
    return db.users.find((u) => u.id === id) || null;
  },

  // Sessions
  async createSession(userId: string, email: string, role: string) {
    const token = generateSessionToken();
    db.sessions.set(token, { userId, email, role });
    return token;
  },

  async getSession(token: string) {
    return db.sessions.get(token) || null;
  },

  async deleteSession(token: string) {
    db.sessions.delete(token);
  },

  // Stores
  async createStore(data: Omit<Store, 'id' | 'created_at' | 'updated_at'>) {
    const store: Store = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.stores.push(store);
    return store;
  },

  async getStoreByVendor(vendorId: string) {
    return db.stores.find((s) => s.vendor_id === vendorId) || null;
  },

  async getAllStores() {
    return db.stores;
  },

  async updateStore(id: string, data: Partial<Store>) {
    const index = db.stores.findIndex((s) => s.id === id);
    if (index === -1) return null;
    db.stores[index] = {
      ...db.stores[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return db.stores[index];
  },

  // Global Products
  async searchGlobalProducts(query: string) {
    const lowerQuery = query.toLowerCase();
    return db.globalProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description?.toLowerCase().includes(lowerQuery) ||
        p.sku?.toLowerCase().includes(lowerQuery) ||
        p.barcode?.toLowerCase().includes(lowerQuery)
    );
  },

  async getGlobalProduct(id: string) {
    return db.globalProducts.find((p) => p.id === id) || null;
  },

  async createGlobalProduct(data: Omit<GlobalProduct, 'id' | 'created_at' | 'updated_at'>) {
    const product: GlobalProduct = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.globalProducts.push(product);
    return product;
  },

  // Vendor Products
  async createVendorProduct(data: Omit<VendorProduct, 'id' | 'created_at' | 'updated_at'>) {
    const product: VendorProduct = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db.vendorProducts.push(product);
    return product;
  },

  async getVendorProductsByStore(storeId: string) {
    const vendorProducts = db.vendorProducts.filter((p) => p.store_id === storeId);
    return vendorProducts.map((vp) => {
      const globalProduct = db.globalProducts.find((gp) => gp.id === vp.global_product_id);
      return {
        ...vp,
        global_product: globalProduct || null,
      };
    });
  },

  async updateVendorProduct(id: string, data: Partial<VendorProduct>) {
    const index = db.vendorProducts.findIndex((p) => p.id === id);
    if (index === -1) return null;
    db.vendorProducts[index] = {
      ...db.vendorProducts[index],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return db.vendorProducts[index];
  },

  async deleteVendorProduct(id: string) {
    const index = db.vendorProducts.findIndex((p) => p.id === id);
    if (index === -1) return false;
    db.vendorProducts.splice(index, 1);
    return true;
  },

  async getPendingProductReviews() {
    const pending = db.vendorProducts.filter((p) => p.approval_status === 'pending_review');
    return pending.map((vp) => {
      const store = db.stores.find((s) => s.id === vp.store_id);
      const globalProduct = db.globalProducts.find((gp) => gp.id === vp.global_product_id);
      return {
        ...vp,
        store: store || null,
        global_product: globalProduct || null,
      };
    });
  },

  // Sales
  async createSale(data: Omit<Sale, 'id' | 'created_at'>) {
    const sale: Sale = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
    };
    db.sales.push(sale);
    return sale;
  },

  async createSaleItem(data: Omit<SaleItem, 'id'>) {
    const item: SaleItem = {
      ...data,
      id: generateId(),
    };
    db.saleItems.push(item);
    return item;
  },

  async getSalesByStore(storeId: string, startDate?: Date, endDate?: Date) {
    let sales = db.sales.filter((s) => s.store_id === storeId);
    
    if (startDate) {
      sales = sales.filter((s) => new Date(s.created_at) >= startDate);
    }
    if (endDate) {
      sales = sales.filter((s) => new Date(s.created_at) <= endDate);
    }
    
    return sales;
  },

  async getTotalRevenue(storeId: string) {
    const sales = db.sales.filter((s) => s.store_id === storeId && s.status === 'completed');
    return sales.reduce((sum, sale) => sum + sale.total_amount, 0);
  },
};
