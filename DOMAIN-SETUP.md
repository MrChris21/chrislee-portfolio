# Connect chrislee.site to Vercel

Your Next.js portfolio is already deployed and linked to this domain in Vercel.
You only need to update DNS at your domain registrar (currently Hostinger parking DNS).

## Live URLs (already working)

- Production: https://portfolio-app-sandy-phi.vercel.app
- GitHub: https://github.com/MrChris21/chrislee-portfolio
- Vercel project: portfolio-app (domains: `chrislee.site`, `www.chrislee.site`)

## Option A — Recommended (A records)

In your domain DNS panel (Hostinger, Namecheap, GoDaddy, etc.):

| Type | Name / Host | Value           | TTL  |
|------|-------------|-----------------|------|
| A    | `@`         | `216.198.79.1`  | 3600 |
| A    | `@`         | `64.29.17.1`    | 3600 |
| CNAME| `www`       | `cname.vercel-dns.com` | 3600 |

Some Vercel setups also accept a single A record:

| Type | Name | Value        |
|------|------|--------------|
| A    | `@`  | `76.76.21.21`|

Use the values shown in:
https://vercel.com/mrchris21s-projects/portfolio-app/settings/domains

## Option B — Vercel nameservers

Change nameservers at your registrar to:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

## After DNS is updated

1. Wait 5 minutes to a few hours (up to 48h in rare cases).
2. SSL certificates are issued automatically by Vercel.
3. Check status:
   ```bash
   vercel domains verify chrislee.site
   ```
4. Visit https://chrislee.site and https://www.chrislee.site

## Current problem (why it is not live yet)

Your domain currently uses Hostinger parking nameservers:

- `ns1.dns-parking.com`
- `ns2.dns-parking.com`

and points to non-Vercel IPs. That is why Vercel reports **Invalid Configuration**.

## Tip if the site still shows the old WordPress host

- Clear CDN/cache at the old host.
- Remove any A/CNAME records that still point to Hostinger WordPress hosting.
- Keep only the Vercel records above.
