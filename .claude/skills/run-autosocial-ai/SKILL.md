---
name: run-autosocial-ai
description: Run, start, build, test, or screenshot the autosocial-ai Next.js web app. Use when asked to launch the app, check a UI page, verify a route, or take a screenshot.
---

# run-autosocial-ai

AutoSocial AI is a Turborepo monorepo. The deployable web app lives at `apps/web` (Next.js 14, port 3000). Drive it with `Invoke-WebRequest` (Windows) or `curl` (bash) for API/page checks, or open a browser to `http://localhost:3000` for UI.

All paths below are relative to the repo root: `C:\Users\Usuario\Desktop\autosocial-ai`.

## Prerequisites

- Node ≥ 20, pnpm 11.x (`pnpm --version`)
- `apps/web/.env.local` must exist with all secrets (DATABASE_URL, ANTHROPIC_API_KEY, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_AI_TOKEN, SESSION_SECRET, etc.)
- `packages/db` must have `DATABASE_URL` set (it reads from `apps/web/.env.local` — run `pnpm db:push` once to sync schema)
- The workers service (`apps/workers`) requires Redis; it will fail with ETIMEDOUT if Redis isn't running — **this is expected and does not block the web app**

## Build

```powershell
cd "C:\Users\Usuario\Desktop\autosocial-ai"
pnpm install
pnpm db:generate   # regenerate Prisma client if schema changed
```

## Run (agent path)

Start the dev server in background, then probe with PowerShell:

```powershell
# Start (run once; already running if port 3000 is occupied)
cd "C:\Users\Usuario\Desktop\autosocial-ai"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c", "pnpm dev > dev-server.log 2>&1" -WindowStyle Hidden
Start-Sleep -Seconds 20   # wait for "Ready in Xs" in log

# Verify web app is up
(Invoke-WebRequest -Uri "http://localhost:3000/sign-in" -UseBasicParsing).StatusCode   # expect 200

# Check API
(Invoke-WebRequest -Uri "http://localhost:3000/api/trpc/health" -UseBasicParsing).StatusCode  # expect 200

# Tail logs
Get-Content "C:\Users\Usuario\Desktop\autosocial-ai\dev-server.log" -Tail 30
```

Key routes to probe:
| Route | What it tests |
|---|---|
| `GET /sign-in` | Public auth page renders |
| `GET /` | Redirects to `/sign-in` (session middleware) |
| `GET /api/trpc/health` | tRPC router is wired |
| `POST /api/trpc/clients.list` | Authenticated tRPC (needs session cookie) |

## Run (human path)

```powershell
cd "C:\Users\Usuario\Desktop\autosocial-ai"
pnpm dev
# Open http://localhost:3000 in browser
# Ctrl-C to stop
```

## Stop server

```powershell
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
```

## Database

```powershell
# Push schema changes
pnpm db:push

# Open Prisma Studio (GUI for DB)
pnpm db:studio
# Opens at http://localhost:5555
```

## Gotchas

- **`packageManager` field required**: Turbo 2.x fails with "Missing `packageManager` field in package.json" if it's absent. It's set to `pnpm@11.5.3` — update if pnpm version changes.
- **Workers ETIMEDOUT is normal**: `apps/workers` connects to Redis on startup. If no Redis is running locally, it logs ETIMEDOUT in a loop. The Next.js web app (`apps/web`) runs independently and is unaffected.
- **Prisma EPERM on generate**: If `prisma generate` fails with EPERM, the old server is holding a DLL lock. Stop all node processes first: `Stop-Process -Name "node" -Force`.
- **`apps/web/.env.local` is gitignored**: Never committed. Contains all secrets. If missing, the app starts but DB calls fail with `DATABASE_URL not set`.
- **Session cookie named `autosocial_session`**: middleware.ts checks for this. Pages redirect to `/sign-in` without it.
- **Image hostnames**: `next.config.js` uses `{ hostname: "**" }` wildcard to allow any CDN (freeimage.host, iili.io, etc.).

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Could not resolve workspaces / Missing packageManager` | Add `"packageManager": "pnpm@11.5.3"` to root `package.json` |
| Port 3000 already in use | `Stop-Process -Name "node" -Force` then restart |
| `prisma generate` EPERM | Stop node processes first |
| `Module not found @/lib/trpc/client` | Import path should be `@/lib/trpc-provider` — check component imports |
| Images 400 in Next.js | Add hostname to `remotePatterns` in `next.config.js` |
| tRPC calls 401 | User not signed in — check `autosocial_session` cookie |
