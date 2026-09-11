# Salamatek — Deployment Guide

**Stack**: Vercel (Next.js frontend) · Render (Express API) · MongoDB Atlas (database)

---

## 1. MongoDB Atlas Setup

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → create a free **M0** cluster
2. Create a **database user** (username + strong password — save these)
3. Under **Network Access** → Add IP Address → click **Allow Access from Anywhere** (`0.0.0.0/0`)
4. Click **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/salamatek?retryWrites=true&w=majority
   ```
   Replace `<user>`, `<password>` with your credentials.

---

## 2. Deploy the API to Render

### A. Create a Web Service
1. Go to [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Set the **Root Directory** to: `server/api`
4. **Build Command**: `npm install && npm run build`
5. **Start Command**: `node dist/index.js`
6. **Node Version**: `20`

### B. Set Environment Variables in Render Dashboard
Under your service → **Environment**:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render sets this automatically) |
| `MONGODB_URI` | `mongodb+srv://...` (from Atlas) |
| `JWT_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` |
| `JWT_EXPIRES_IN` | `30d` |
| `CLIENT_URL` | `https://www.yourdomain.com,https://yourdomain.com` |

Leave SMTP vars blank — email uses the dev stream logger when not configured.

### C. Note Your API URL
After deploy, Render gives you a URL like: `https://salamatek-api.onrender.com`
Save this — you'll need it for Vercel.

---

## 3. Deploy the Frontend to Vercel

### A. Import Project
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import from GitHub
3. **Root Directory**: `apps/web`
4. **Framework Preset**: Next.js (auto-detected)
5. **Build Command**: `next build` (default)

### B. Set Environment Variables in Vercel Dashboard
Under your project → **Settings** → **Environment Variables**:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://salamatek-api.onrender.com` (your Render URL) |
| `NEXT_PUBLIC_SITE_URL` | `https://www.yourdomain.com` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `dk6llcof2` |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | `salamatek_preset` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `966XXXXXXXXX` |

### C. Add Your Custom Domain
1. Vercel project → **Settings** → **Domains**
2. Add `yourdomain.com` and `www.yourdomain.com`
3. Vercel gives you DNS records → add to your domain registrar
4. SSL is provisioned automatically

---

## 4. Create the First Admin User

After the API is live, create your admin account once:

```bash
curl -X POST https://salamatek-api.onrender.com/api/auth/setup
```

This creates:
- **Email**: `admin@salamatek.com`
- **Password**: `admin123`

> Change the password immediately after first login!
> The `/api/auth/setup` endpoint returns 403 in production after first use.

---

## 5. Update CORS After Deployment

Once your Vercel domain is live, update `CLIENT_URL` in Render to:
```
https://www.yourdomain.com,https://yourdomain.com
```

Render auto-redeploys on env var changes.

---

## 6. Enable HSTS (After SSL is Confirmed)

Once HTTPS is working, uncomment in `next.config.ts`:

```ts
{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
```

---

## Post-Deploy Checklist

- [ ] MongoDB Atlas cluster running, IP whitelist set to 0.0.0.0/0
- [ ] Render API deploys → `https://your-api.onrender.com/api/health` returns `{ success: true }`
- [ ] Vercel build passes, site loads at your domain
- [ ] Admin login works at `https://yourdomain.com/admin`
- [ ] Contact form submission appears in admin panel
- [ ] Domain DNS records pointing to Vercel
- [ ] SSL certificate active
- [ ] CORS working (no browser console errors)
- [ ] Default admin password changed

---

## Useful Commands

```bash
# Local development
npm run dev

# Verify TypeScript before deploying
npm run typecheck --workspaces

# Test production build locally
npm run build --workspaces
```
