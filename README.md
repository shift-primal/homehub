# homehub

Dashboard for my homelab and self-hosted projects. It shows every service with a live up/down status and version, plus CPU, memory, disk and temperature for each machine.

## How it works

- `src/server/services.ts` lists the services and how to probe each one (Jellyfin and Seerr report a version, *arr apps answer `/ping`, everything else gets a plain HTTP check).
- `src/server/get-service.ts` runs the probes server-side with a 3 s timeout.
- `src/server/beszel.ts` reads machine stats from the [Beszel](https://github.com/henrygd/beszel) hub's PocketBase API using a read-only account.

Built with TanStack Start, TanStack Query, Tailwind and shadcn. The hub is deployed with Docker; the read-only Beszel account is provisioned from my NixOS config.

## Run

```sh
cp .env.example .env   # fill in BESZEL_URL, BESZEL_EMAIL, BESZEL_PASSWORD
pnpm install
pnpm dev               # http://localhost:3000
```

With `APP_ENV=dev`, services are probed on their public URLs. Without Beszel credentials the stats card is skipped.
