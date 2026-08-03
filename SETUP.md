# NextUp — shared/synced setup

Your song data now lives in a Supabase table instead of just the browser's memory,
so every device that opens the site sees the same, up-to-date list.

## 1. Create a Supabase project
1. Go to https://supabase.com → sign up (free tier is plenty) → **New project**.
2. Wait ~2 min for it to spin up.

## 2. Create the table
In your Supabase project: **SQL Editor** → **New query** → paste and run:

```sql
create table nextup_state (
  id int primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

alter table nextup_state enable row level security;

-- Anyone with the anon key can read and write this one row.
-- Fine for a small shared tool; tighten this if you ever add real user accounts.
create policy "public read" on nextup_state for select using (true);
create policy "public write" on nextup_state for insert with check (true);
create policy "public update" on nextup_state for update using (true);
```

Then turn on realtime for the table: **Database → Replication** → find `nextup_state`
→ toggle it on (this is what lets other open tabs/devices update live).

## 3. Get your API keys
**Project Settings → API**. You need:
- **Project URL**
- **anon public** key (NOT the service_role key)

## 4. Local setup
```bash
npm install
cp .env.example .env
```
Edit `.env` and paste in your Project URL and anon key.

```bash
npm run dev
```
Open the local URL it prints — try marking a song as practiced, then refresh. It should stick.

## 5. Deploy to Netlify
1. Push this folder to a GitHub repo (or drag-and-drop the folder into Netlify's UI).
2. In Netlify: **Add new site → Import from Git**, pick the repo.
   - Build command: `npm run build` (already set in `netlify.toml`)
   - Publish directory: `dist` (already set in `netlify.toml`)
3. **Site settings → Environment variables**, add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy. Every visitor now reads/writes the same Supabase row — changes made on
   your phone show up on your laptop within a second or two.

## Notes
- This uses one shared row (no login) — anyone with the site URL can edit the queue.
  That's fine for a personal/band tool; say the word if you'd rather add a simple
  password gate or per-user accounts later.
- Saves are debounced by 500ms so rapid edits (like clicking through statuses) don't
  spam the database.
