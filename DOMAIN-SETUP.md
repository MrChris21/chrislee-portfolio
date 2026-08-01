# Point chrislee.site to this new portfolio (leave Hostinger WordPress)

Your **new** Next.js site is already connected in Vercel:

| Item | Value |
|------|--------|
| Vercel project | `portfolio-app` |
| Apex domain | `chrislee.site` |
| WWW | `www.chrislee.site` |
| Preview URL | https://portfolio-app-sandy-phi.vercel.app |

Right now **DNS still points at Hostinger WordPress**, so visitors see the old site.

---

## What you need to change (Hostinger only)

You do **not** need to “move the domain between Vercel projects” again — Vercel is ready.  
You only need to **stop Hostinger from serving the old portfolio** and **point DNS to Vercel**.

### Step 1 — Open Hostinger DNS

1. Log in: https://hpanel.hostinger.com  
2. Go to **Domains** → **chrislee.site**  
3. Open **DNS / DNS Zone Editor**

### Step 2 — Remove old WordPress / Hostinger records

Delete or edit these if they exist (they send traffic to the old site):

- **A** records for `@` that point to Hostinger IPs (e.g. `77.x`, `147.x`, `148.x`, `193.x`)
- **CNAME** for `www` pointing to `*.hstgr.net` or Hostinger CDN
- Any **A** / **AAAA** for `www` pointing at Hostinger

Keep other records you still need (email MX, etc.) unless you know you should remove them.

### Step 3 — Add Vercel records

| Type | Name | Value | TTL |
|------|------|--------|-----|
| **A** | `@` | `76.76.21.21` | 3600 or default |
| **CNAME** | `www` | `cname.vercel-dns.com` | 3600 or default |

If Vercel’s domain page shows **two A records** instead, use those:

| Type | Name | Value |
|------|------|--------|
| **A** | `@` | `216.198.79.1` |
| **A** | `@` | `64.29.17.1` |
| **CNAME** | `www` | `cname.vercel-dns.com` |

Confirm exact values here:  
https://vercel.com/mrchris21s-projects/portfolio-app/settings/domains

### Step 4 — Optional: Hostinger “Website” / WordPress

If Hostinger still has a website assigned to `chrislee.site`:

1. **Websites** → find the WordPress portfolio  
2. Either **pause**, **delete**, or **change domain** of that hosting package  
   so Hostinger is not fighting for the domain  

(You can keep files as backup; just don’t keep DNS pointing at Hostinger.)

### Step 5 — Wait and verify

1. Wait **5–60 minutes** (sometimes up to 24–48h)  
2. Open https://chrislee.site — you should see the **new** Next.js portfolio (binary rain, Resume/CV, etc.)  
3. Open https://www.chrislee.site — same site  
4. SSL is automatic on Vercel after DNS is correct  

Check status:

```bash
cd "/Users/saint_chris/Documents/Files/My Portfolio:VC/portfolio-app"
vercel domains verify chrislee.site
```

You want: **DNS Configuration ✔ Valid**

---

## Optional: Vercel nameservers instead of A records

In Hostinger → Domains → **Nameservers** → Custom:

- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

Then Hostinger DNS editor is no longer used for this domain; Vercel manages DNS.

---

## Subdomains (safe to keep)

| Subdomain | Project |
|-----------|---------|
| `pos.chrislee.site` | `flores-pos` (your POS app) |

Changing apex/`www` does **not** remove `pos.chrislee.site` if that record stays in DNS.

---

## Quick checklist

- [ ] Vercel project `portfolio-app` has `chrislee.site` + `www` (already done)
- [ ] Hostinger A `@` → Vercel (`76.76.21.21` or the two A records Vercel shows)
- [ ] Hostinger CNAME `www` → `cname.vercel-dns.com`
- [ ] Old Hostinger WordPress A/CNAME removed
- [ ] Wait for DNS → new site loads on https://chrislee.site
