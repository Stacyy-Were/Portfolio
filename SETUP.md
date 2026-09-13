# Setup guide — React/Vite portfolio

The component is fully interactive out of the box: typed roles, a working terminal (try typing `help`, `skills`, `scan`...), clickable lab cards, filterable languages, and an email-gated résumé download.

## 1. Store your résumé privately
Place the résumé at `main/public/resume.pdf`. The app checks the email format,
requires consent to share the address for the résumé request, and starts the
download. This simple option does not verify that the address belongs to the
person entering it. Device fingerprinting is not currently active.

## 2. Configure Supabase for contact messages
If you want the contact form to save messages, go to [supabase.com](https://supabase.com) and create a project. In the SQL editor, run:
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
Go to **Project Settings → API** and copy your **Project URL** and **publishable key**. For local development, add them to `main/.env.local`:
```js
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```
The component talks to Supabase with a plain `fetch` call (no extra npm package needed), so it works the moment those two values are real.

## 3. Run it as a real app
The app is already set up in the `main` directory. Run it locally with:
```bash
cd main
npm install
npm run dev
```

To deploy on Vercel, import the repository and set **Root Directory** to `main`. Add these Environment Variables only if you use the contact form:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

Use the Supabase Project URL and the public `anon` key from **Project Settings → API**. Do not use the service-role key in Vercel or frontend code.

## Notes
## 4. Things you still need to fill in
A few placeholders were left on purpose for you to personalize:
- **My Journey section** — 4 empty milestone cards (year, title, description) for your own story.
- **About → Outside the terminal** — 3 "[Add CTF focus]" pills for the CTF categories you're leveling up in.
- **HackerDNA-CTF project card** — no repo link was given, so it currently links to your GitHub profile instead. Swap in the real repo URL in the `PROJECTS` array once it's public.
- **Social bar (bottom of the page)** — GitHub, Email, and Teams links are live (Teams uses a `teams.microsoft.com` deep link to your email — works if that email is Teams-enabled). **LinkedIn** and **WhatsApp** are placeholders (`href="#"`) — add your real LinkedIn URL and a `https://wa.me/<yournumber>` link in the `SOCIALS` array.
