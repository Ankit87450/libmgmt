# Library Management System

Full-stack demo Library Management System built with **Next.js 16** (App
Router), **shadcn/ui**, **Redux Toolkit (RTK Query)**, **React Hook Form**, and
**Zod**. State is persisted to **Postgres (Supabase)** as a single JSONB row,
so deployment works on Vercel serverless. Session-cookie auth; server-side
route protection via Next middleware.

## Quick start

```bash
npm install
cp .env.example .env   # then fill in DATABASE_URL
npm run dev            # http://localhost:3000
npm run build
npm run typecheck
```

First run creates a `libmgmt_state` table in your Postgres database and seeds
it with one JSONB row. To reset, hit `DELETE /api/db` as an admin, or
`TRUNCATE libmgmt_state;` and restart.

### Supabase notes

- Copy the connection string from **Dashboard → Project Settings → Database →
  Connection string → URI** (or the pooler one if direct is IPv6-only on your
  plan).
- **URL-encode any special characters** in the password. `$` → `%24`, `@` →
  `%40`, `:` → `%3A`, etc. Without this, Next.js's env-file parser expands
  sequences like `$1` and `pg`'s URI parser misreads the delimiters.
- If you can't reset the DB password, use the **explicit fields** form in
  `lib/server/pool.ts` instead of a connection string — that skips URL parsing
  entirely.

## Demo credentials

| Role  | User ID | Password |
|-------|---------|----------|
| Admin | `adm`   | `adm`    |
| User  | `user`  | `user`   |

When Admin adds a new user via Maintenance → User Management, the backend
derives a `username` from the given name (e.g. `John Doe` → `johndoe`) and
sets the password to the first name lowercase. Change it later with
`PATCH /api/users/:id` if needed.

## Architecture

```
JSON file on disk  (data/db.json)
        ▲
        │  fs read/write  (lib/server/db.ts, serialized mutations)
        │
Next.js route handlers  (app/api/**/route.ts)
        ▲
        │  fetch + HTTP-only session cookie
        │
RTK Query api slice  (features/api.ts)
        ▲
        │  useXQuery / useXMutation
        │
React Hook Form pages  (app/**, components/pages/**)
```

### Auth

- Session cookie `lms_session` (HTTP-only, 8-hour TTL) set on login, stored in
  `db.sessions[]`.
- `middleware.ts` runs at the edge, redirects any `/admin/*` or `/user/*`
  request lacking the cookie to `/login?next=...`.
- Each API route calls `requireSession()` or `requireAdmin()` to validate both
  the cookie and role against the current DB state.
- Client guards (`RequireRole`) are kept as a UX safety net only — the
  authoritative check is server-side.

### Data persistence

- `lib/server/db.ts` wraps `fs.readFileSync` / `fs.writeFileSync` and exposes a
  `mutate(cb)` helper that serializes writes through a single in-process
  Promise chain to avoid interleaved writes.
- No ORM, no SQL. Suitable for a single-node dev server; **not** a clustered
  production setup.

### Inspection route

`GET /api/db` (requires any session) returns the entire current JSON state
with user passwords and session tokens redacted. Great for debugging or
screenshots.

`DELETE /api/db` (admin only) resets the DB back to seed.

## API surface

| Method · Path                                          | Access | Purpose                   |
|--------------------------------------------------------|--------|---------------------------|
| `POST /api/auth/login`                                 | any    | `{username,password,role}` → sets cookie |
| `POST /api/auth/logout`                                | any    | clears cookie & server session |
| `GET  /api/auth/me`                                    | any    | current session user or `null` |
| `GET  /api/db`                                         | session | full JSON state (redacted) |
| `DELETE /api/db`                                       | admin  | reset to seed             |
| `GET  /api/items`                                      | session | list books/movies         |
| `POST /api/items`                                      | admin  | add book/movie            |
| `PATCH /api/items/[serial]`                            | admin  | update item (status, etc.)|
| `GET  /api/members`                                    | session | list members              |
| `POST /api/members`                                    | admin  | add membership            |
| `POST /api/members/[id]/extend`                        | admin  | `{extension:"6m"\|"1y"\|"2y"}` |
| `POST /api/members/[id]/cancel`                        | admin  | mark inactive             |
| `GET  /api/users`                                      | admin  | list app users            |
| `POST /api/users`                                      | admin  | add user                  |
| `PATCH /api/users/[id]`                                | admin  | update user               |
| `GET  /api/transactions/issues`                        | session | list issues               |
| `POST /api/transactions/issues`                        | session | issue book                |
| `POST /api/transactions/issues/[id]/return`            | session | record actual return date |
| `POST /api/transactions/issues/[id]/complete`          | session | settle fine & complete    |
| `GET  /api/transactions/requests`                      | session | list open requests        |
| `GET  /api/settings`                                   | session | fine rate, etc.           |
| `PATCH /api/settings`                                  | admin  | update settings           |

## Modules

- **Transactions** (Admin + User): Book Availability, Issue, Return, Pay Fine.
- **Reports** (Admin + User): Master lists (Books, Movies, Memberships),
  Active Issues, Overdue Returns, Issue Requests.
- **Maintenance** (Admin only): Membership Add/Update, Book/Movie Add/Update,
  User Management Add/Update.

## Validation summary

| Form                  | Rules                                                                             |
|-----------------------|-----------------------------------------------------------------------------------|
| Login                 | both fields required; password hidden; credentials checked server-side            |
| Availability          | at least one filter field required                                                |
| Issue                 | book, member required; issue ≥ today; return ≤ issue + 15                         |
| Return                | all except remarks required                                                       |
| Pay Fine              | `finePaid` required when `fineCalculated > 0` (server rejects otherwise)          |
| Add Membership        | all fields required; radio (6m/1y/2y, default 6m)                                 |
| Update Membership     | ID required; extend (default) or cancel — cancel opens a confirm dialog           |
| Add Book/Movie        | kind radio (default book); all fields required                                    |
| Update Book/Movie     | kind radio; status + status-change date; procurement date is read-only            |
| User Add / Update     | mode radio (default new); Name required; Active + Admin checkboxes                |

## Deployment

| Platform                           | Works?                                | Notes |
|------------------------------------|---------------------------------------|-------|
| `npm run dev` / `npm start` (any VPS, Railway, Render, Fly.io) | ✅ fully persistent | `data/db.json` lives with the app. |
| **Vercel serverless**              | ⚠️ works, but **data doesn't persist** | Falls back to `/tmp/libmgmt/db.json`. Each cold start **re-seeds** and different function instances see different `/tmp`. Fine for a demo; unusable for real use. |
| AWS Lambda                         | same as Vercel                        | same caveat — `/tmp` is per-invocation. |
| Cloudflare Workers / Edge runtimes | ❌                                    | No `fs` access at all. |

Override the data directory with `LMS_DB_DIR=/path/to/dir` if neither default
fits.

If you want real persistence on Vercel, swap `lib/server/db.ts` to a Vercel KV
/ Upstash Redis / Postgres-backed implementation — the `readDb` / `mutate`
signatures stay the same so no route handlers need to change.

## Known caveats / out of scope

1. Fine rate defaults to **₹10/day** but is stored in `db.settings.finePerDay`
   and editable via `PATCH /api/settings`.
2. Passwords are stored in plain text in `db.json` — fine for a local demo,
   unacceptable for production.
3. The write serialization is in-process. If you run multiple Node processes
   (e.g. PM2 cluster or Vercel serverless with concurrent instances), writes
   race. Use a real DB for that.
4. The "Chart" page is a textual summary rather than a rendered flow diagram.
5. No pagination/sorting/search on reports.
6. No 404/500 styled pages beyond Next.js defaults.
