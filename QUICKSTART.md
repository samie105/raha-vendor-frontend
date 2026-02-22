# Raha - Quick Start Guide

## 🚀 Get Running in 5 Minutes

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Supabase
- Create a Supabase project at https://supabase.com
- Copy the SQL schema from `SETUP.md`
- Paste and run in your Supabase SQL editor

### 3. Set Environment Variables
```bash
# Create .env.local
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Start Development Server
```bash
pnpm dev
```

### 5. Test It Out!
Visit `http://localhost:3000` and:
1. Click "Get Started"
2. Register as a vendor
3. Create a store
4. Add a product
5. View your dashboard

## 📖 Project Structure

| Path | Purpose |
|------|---------|
| `app/(auth)` | Login/Register pages |
| `app/(dashboard)` | Vendor dashboard pages |
| `app/(admin)` | Admin review panel |
| `components/` | Reusable UI components |
| `lib/actions/` | Server actions (API layer) |
| `lib/schemas.ts` | Data validation rules |
| `lib/supabase/` | Database clients |

## 🔑 Key Features

### For Vendors:
- 🏪 Store setup
- 📦 Product management with global directory search
- 📊 Real-time sales dashboard
- 📈 Analytics with charts

### For Admins:
- ✅ Review pending products
- 🔍 Standardize product data
- 📋 Manage global directory

## 🗄️ Database Tables

| Table | Purpose |
|-------|---------|
| `users` | User roles (vendor/admin) |
| `stores` | Vendor storefronts |
| `global_products` | Centralized product directory |
| `vendor_products` | Store inventory |
| `sales` | Transaction records |

## 🔐 Routes

### Public Routes:
- `/` - Landing page
- `/login` - Vendor/Admin login
- `/register` - Vendor registration

### Protected Vendor Routes:
- `/dashboard` - Home
- `/dashboard/products` - Inventory
- `/dashboard/products/add` - Add product
- `/dashboard/settings` - Store settings
- `/dashboard/analytics` - Sales metrics

### Protected Admin Routes:
- `/admin` - Dashboard
- `/admin/products` - Product reviews

## 🛠️ Tech Stack

```
Frontend: Next.js 16 + React 19 + TypeScript
Database: PostgreSQL (Supabase)
Auth: Supabase Auth (JWT)
Styling: Tailwind CSS 4
Validation: Zod
Charts: Recharts
```

## 📝 Zod Schemas

All data is validated using Zod schemas in `lib/schemas.ts`:
- User registration/login
- Store creation/updates
- Product creation/updates
- Sales transactions

## 🚀 Deployment

### Prepare for Production:
```bash
# Build
pnpm build

# Start
pnpm start
```

Deploy to Vercel, Netlify, or your preferred host.

## 🐛 Troubleshooting

### "Not authenticated" error?
- Make sure you're logged in
- Check browser dev tools → Application → Cookies
- Clear cookies and re-login

### Products not showing?
- Add products to the `global_products` table first
- Or submit manual products (they'll be pending)

### Admin review panel empty?
- Products auto-approve if linked to global directory
- Only manual submissions appear as pending

## 📚 Learn More

- **SETUP.md** - Detailed setup with SQL
- **IMPLEMENTATION.md** - Architecture & roadmap
- **lib/schemas.ts** - All data models

## 🎯 Next Steps

1. ✅ Install & setup
2. ✅ Create test account
3. ✅ Add products
4. ✅ Track sales
5. → Add customer storefront
6. → Setup payments
7. → Deploy to production

---

**Questions?** Check SETUP.md for detailed instructions.

**Ready to build?** `pnpm dev` 🚀
