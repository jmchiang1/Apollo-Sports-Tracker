# Cloud sync setup (Supabase)

Turns the tracker from single-device (`localStorage`) into **synced across all
your devices**. Sign in with your email on each device; your data lives in one
private row in Supabase, protected by Row Level Security so only you can read it.

Without this configured, the app just runs local-only — nothing breaks.

## One-time setup (~10 minutes)

### 1. Pick a Supabase project
- Create a new one at [supabase.com](https://supabase.com), **or reuse an existing
  project** — one project can host many apps. This app's table is namespaced
  (`apollo_app_state`) so it won't collide with anything already there.

### 2. Create the table + security rules
- In the project, open **SQL Editor → New query**.
- Paste the contents of [`supabase/schema.sql`](../supabase/schema.sql) and click **Run**.
- This creates the `apollo_app_state` table and locks it so each user only sees
  their own row. Safe to run even if the project has other tables.

### 3. Allow this app's URLs for login
- Go to **Authentication → URL Configuration → Redirect URLs** and **add** (don't
  remove any existing ones):
  - `https://jmchiang1.github.io/Apollo-Sports-Tracker/`
  - `http://localhost:3000/`
- Leave **Site URL** as-is — the app sends an explicit redirect, so a shared
  project's Site URL (used by your other app) doesn't need to change.
- Email auth (magic links) is on by default — no password needed.

### 4. Grab your keys
- Go to **Project Settings → API** and copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- The anon key is safe to expose in a static site; RLS + login is what protects your data.

### 5a. Enable it locally
- Copy `.env.local.example` to `.env.local` and paste the two values.
- Restart `npm run dev`. A **"Sync across devices"** option appears in the sidebar.

### 5b. Enable it on GitHub Pages
- In the repo: **Settings → Secrets and variables → Actions → New repository secret**.
- Add two secrets with the same names/values:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Push to `main` — the deploy workflow bakes them into the build.

## Moving your existing progress to another device

Your current progress lives on the **first device's browser**. To get it everywhere:

1. On the device that **has** your progress, open the app → **Sync across devices** → sign in. This **uploads** your progress to the cloud.
2. On the **other** device, sign in with the same email. It **downloads** your progress.

From then on, every edit syncs automatically (and again whenever you refocus the tab). Edits made on two devices merge per task by most-recent-change, so nothing gets lost.

## Notes
- The free tier's built-in email sender is rate-limited but fine for one user. For higher volume, add custom SMTP under Authentication → Emails.
- Signing out leaves your data safely in the cloud and in that device's local cache.
