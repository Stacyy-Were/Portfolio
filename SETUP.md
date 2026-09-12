# Setup guide — React/Vite portfolio

The component is fully interactive out of the box: typed roles, a working terminal (try typing `help`, `skills`, `scan`...), clickable lab cards, filterable languages, and an email-gated résumé download. Two things to plug in before it's live.

## 1. Add your résumé
Wherever you deploy this app, place your résumé PDF at the path referenced by `RESUME_FILE_PATH` near the top of the file (defaults to `resume.pdf` in the app's public root).

## 2. Create your Supabase table
1. Go to [supabase.com](https://supabase.com) → create a free project.
2. In the SQL editor, run:
```sql
create table resume_requests (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  created_at timestamptz default now()
);

alter table resume_requests enable row level security;

create policy "Allow public inserts"
on resume_requests
for insert
to anon
with check (true);
```
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.
4. For local development, copy `main/.env.example` to `main/.env.local` and replace the values:
```js
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
The component talks to Supabase with a plain `fetch` call (no extra npm package needed), so it works the moment those two values are real.

## 3. Run it as a real app
The app is already set up in the `main` directory. Run it locally with:
```bash
cd main
npm install
npm run dev
```

To deploy on Vercel, import the repository, set **Root Directory** to `main`, and add these Environment Variables for **Production**, **Preview**, and **Development**:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Use the Supabase Project URL and the public `anon` key from **Project Settings → API**. Do not use the service-role key in Vercel or frontend code.

## Notes
- **Live preview in this chat**: the interactive version you saw rendered here runs in a sandboxed preview — external network calls (like the Supabase request) may be blocked there even with real credentials. Once you run it as a real deployed app (step 3), the résumé-gate → Supabase → download flow works end-to-end.
- Until real Supabase credentials are added, the "Get résumé" button shows a friendly message instead of failing silently.
- View submitted emails anytime in Supabase → Table Editor → `resume_requests`.

## 4. Second table for the "Send me a message" form
The contact form in the "Open to opportunities" section posts to a second table. Run this too:
```sql
create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

alter table contact_messages enable row level security;

create policy "Allow public inserts"
on contact_messages
for insert
to anon
with check (true);
```

## 5. Things you still need to fill in
A few placeholders were left on purpose for you to personalize:
- **My Journey section** — 4 empty milestone cards (year, title, description) for your own story.
- **About → Outside the terminal** — 3 "[Add CTF focus]" pills for the CTF categories you're leveling up in.
- **HackerDNA-CTF project card** — no repo link was given, so it currently links to your GitHub profile instead. Swap in the real repo URL in the `PROJECTS` array once it's public.
- **Social bar (bottom of the page)** — GitHub, Email, and Teams links are live (Teams uses a `teams.microsoft.com` deep link to your email — works if that email is Teams-enabled). **LinkedIn** and **WhatsApp** are placeholders (`href="#"`) — add your real LinkedIn URL and a `https://wa.me/<yournumber>` link in the `SOCIALS` array.
