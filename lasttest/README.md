# Rafna Investment

A premium, responsive e-commerce website for **Rafna Investment**, a Nairobi-based retailer of quality foam, fiber & spring orthopaedic mattresses, luxury beddings, and household essentials.

## Live features

- **Homepage** with hero, policies, category showcase and featured products.
- **Shop page** with category filtering, sorting and realistic product cards.
- **One-click ordering** via WhatsApp — every product card has an **Order Now** button that opens a clean checkout modal.
- **Admin dashboard** at `/admin` protected by password `Rafna2026!`.
- **Product management** form + table with Add / Delete.
- **Supabase integration** for products database and image storage, with a local browser fallback for demo / offline use.
- **Mobile-first responsive** design with luxury typography and professional spacing.

## Tech stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4
- React Router
- Framer Motion
- Supabase JS client
- Lucide React icons

## Supabase setup (required for live data)

1. Create a project at [https://supabase.com](https://supabase.com).
2. In the SQL editor, create the `products` table:

```sql
create table products (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  title text not null,
  category text not null,
  price numeric not null,
  description text not null,
  image_url text not null
);

-- Enable Row Level Security and allow anonymous access for this demo
-- (replace with proper auth in production)
alter table products enable row level security;

create policy "Allow anonymous read" on products
  for select using (true);

create policy "Allow anonymous insert" on products
  for insert with check (true);

create policy "Allow anonymous delete" on products
  for delete using (true);
```

3. Create a public storage bucket named `product-images` and make it public. Set its RLS policies to allow uploads/deletes, or start with the `anon` role allowed for demo purposes.
4. Copy your project URL and anon key into `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

5. Run `npm install` and `npm run build`, then deploy.

Without Supabase credentials the site still works fully in **local demo mode** using `localStorage` for products and base64 images.

## Admin password

Default: `Rafna2026!`

## Contact

- WhatsApp / Phone: [0710 565055](https://wa.me/254710565055)
- Email: [rafnainvestment@gmail.com](mailto:rafnainvestment@gmail.com)
- Location: Kamkunji, Nairobi

## Policies

- Free delivery within Nairobi & surroundings
- Country-wide delivery at affordable prices
- Pay on Delivery available within Nairobi & surroundings
