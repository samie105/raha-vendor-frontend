# Raha - Vendor Management System & Centralized Product Directory

A comprehensive Next.js solution for managing vendors, products, inventory, and sales analytics.

## 🎯 Project Overview

Raha is a two-part ecosystem:

1. **Centralized Product Directory** - Admin-moderated database of standardized grocery products
2. **Multi-tenant Vendor Application** - Individual storefronts for vendors to manage their businesses

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)
- Supabase account (for database)

### Installation

1. **Clone and install dependencies:**
```bash
pnpm install
```

2. **Setup environment variables:**
```bash
cp .env.local.example .env.local
```

Add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Setup Supabase Database:**

Run these SQL migrations in your Supabase SQL editor:

```sql
-- Users (extends auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('admin', 'vendor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Product Categories
CREATE TABLE product_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Global Products (Centralized Directory)
CREATE TABLE global_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES product_categories(id),
  description TEXT,
  image_url TEXT,
  sku TEXT,
  barcode TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Stores (Vendor Storefronts)
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  contact_email TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Vendor Products (Store Inventory)
CREATE TABLE vendor_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  global_product_id UUID REFERENCES global_products(id),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  local_price DECIMAL(10,2) NOT NULL,
  cost_price DECIMAL(10,2),
  stock_count INTEGER NOT NULL DEFAULT 0,
  min_stock_level INTEGER DEFAULT 0,
  approval_status TEXT CHECK (approval_status IN ('pending_review', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Sales
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  total_amount DECIMAL(10,2) NOT NULL,
  items_count INTEGER NOT NULL,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Sale Items
CREATE TABLE sale_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  vendor_product_id UUID NOT NULL REFERENCES vendor_products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items ENABLE ROW LEVEL SECURITY;
```

4. **Run development server:**
```bash
pnpm dev
```

Visit `http://localhost:3000`

## 📁 Project Structure

```
app/
├── (auth)/              # Authentication pages
│   ├── login/
│   └── register/
├── (dashboard)/         # Vendor dashboard
│   └── dashboard/
│       ├── products/
│       ├── analytics/
│       └── settings/
├── (admin)/             # Admin panel
│   └── admin/
│       └── products/    # Product review panel
├── layout.tsx
└── page.tsx            # Landing page

components/
├── auth-signin-form.tsx
├── auth-signup-form.tsx
├── add-product-form.tsx
├── product-search.tsx
├── admin-product-review.tsx
├── store-settings-form.tsx
└── ui/                 # UI components (button, card, input, etc.)

lib/
├── supabase/
│   ├── client.ts       # Browser client
│   └── server.ts       # Server client
├── actions/
│   ├── auth.ts         # Authentication actions
│   ├── store.ts        # Store management
│   ├── products.ts     # Product management
│   └── analytics.ts    # Sales & analytics
├── schemas.ts          # Zod validation schemas
└── utils.ts            # Utility functions
```

## 🔐 Authentication

- Email/password based with Supabase Auth
- JWT session management
- Role-based access (Vendor/Admin)
- Protected routes with server components

## 📊 Key Features

### For Vendors:
- ✅ Store setup and management
- ✅ Product search from global directory with auto-fill
- ✅ Manual product submission with admin review
- ✅ Inventory management (pricing, stock)
- ✅ Sales tracking and analytics
- ✅ Real-time metrics dashboard

### For Admins:
- ✅ Product review and approval panel
- ✅ Data standardization and correction
- ✅ Centralized product directory management
- ✅ System overview dashboard

## 🛠️ Technology Stack

- **Frontend:** Next.js 16+, React 19, TypeScript
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth
- **Validation:** Zod
- **Styling:** Tailwind CSS 4 with theme variables
- **UI Components:** Shadcn/ui, Radix UI
- **Charts:** Recharts
- **State Management:** Server actions + React Server Components

## 📝 Database Schema Highlights

### Users
- Extended Supabase auth.users
- Role-based (admin/vendor)

### Stores
- Vendor-specific storefronts
- Contact and location details

### Products
- Global products (standardized, admin-verified)
- Vendor products (local inventory with pricing)
- Linked via `global_product_id` (nullable for manual entries)

### Sales
- Transaction tracking
- Real-time sales metrics
- Detailed line items

## 🔄 Product Workflow

1. **Vendor Adds Product:**
   - Searches global directory
   - If found: Auto-fills data (approved status)
   - If not found: Creates manual entry (pending status)

2. **Admin Review:**
   - Receives notification for pending products
   - Can edit, approve, or reject
   - Rejection includes notes for vendor

3. **Product Goes Live:**
   - Approved products appear in vendor's inventory
   - Added to global directory for future use

## 🧪 Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

## 📚 API Routes & Server Actions

All business logic uses Next.js Server Actions:
- `/lib/actions/auth.ts` - Authentication
- `/lib/actions/store.ts` - Store management
- `/lib/actions/products.ts` - Product operations
- `/lib/actions/analytics.ts` - Sales & metrics

## 🎨 Styling

Uses Tailwind CSS 4 with CSS variables for theming:
- Light/dark mode support
- Consistent color system
- Responsive design (mobile-first)

## 📞 Support

For issues or questions about the development, refer to the PRD document in the project root.

---

**Built with ❤️ for RICHIE & WIZZY**
