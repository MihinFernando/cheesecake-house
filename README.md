# The Cheesecake House

A Next.js storefront for The Cheesecake House. Products and customer reviews
are loaded from Supabase, and orders are started through pre-filled WhatsApp
messages.

## Features

- Responsive storefront with animated sections
- Supabase-backed products and reviews
- Availability controls for products
- Authenticated admin dashboard at `/admin`
- WhatsApp ordering links

## Local Development

Create `.env.local` with:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Install dependencies and start the app:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` for the storefront or
`http://localhost:3000/admin` for the admin dashboard.

## Supabase Setup

The app expects `products` and `reviews` tables. Create an admin user in
Supabase Authentication using email/password sign-in.

Assign the admin user's `app_metadata.role` to `admin`, then run
[`supabase/admin-rls.sql`](supabase/admin-rls.sql) in the Supabase SQL editor.
Review and remove any older permissive write policies, since Supabase policies
are combined and an old policy could still allow anonymous writes.

## Verification

```bash
npm run lint
npm run build
```
