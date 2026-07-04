# Maa Saraswati Coaching Classes

Production coaching management website for **Maa Saraswati Coaching Classes**, Bilaspur.

## Stack

Next.js 15 · React 19 · TypeScript · Tailwind CSS · Shadcn UI · Framer Motion · Supabase

## Setup

1. Copy `.env.example` to `.env.local` and add Supabase credentials.
2. Run the SQL in `supabase/migrations/001_coaching_schema.sql` in your Supabase SQL Editor.
3. Create a public Storage bucket named `uploads`.
4. Install and run:

```bash
npm install
npm run dev
```

## Admin Login

- URL: `/admin/login`
- Username: `MScc1245879`
- Password: `MsEc@3123`

## Portals

- **Student:** `/student/login`
- **Teacher:** `/teacher/login`

## Notes

- Fee payments are **offline only** — no payment gateway.
- Homework/assignments are assigned to **classes** and optional **sections** (not batches).
- This project is separate from the Shoe Mafia e-commerce site.

## Footer

Made by **HKS Web Development Company** · 9406112110
