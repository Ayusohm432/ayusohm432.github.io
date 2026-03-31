# 🚀 Full Deployment Guide — Ayush Kumar Portfolio

> **Stack:** React (Vite) → GitHub Pages | FastAPI → Render | PostgreSQL → Supabase

Follow these phases **in order**. The whole process takes about 20 minutes.

---

## 📋 Prerequisites

| Tool | Purpose |
|---|---|
| GitHub account | Source code + CI/CD + hosting |
| [Render](https://render.com) account (free) | Python backend hosting |
| [Supabase](https://supabase.com) account (free) | PostgreSQL database |
| [Vercel](https://vercel.com) account *(optional)* | Alternative frontend hosting |

---

## ⚡ Phase 0: Push Your Code

Make sure everything is committed and pushed to your `main` branch:

```bash
git add .
git commit -m "feat: portfolio v2 — full stack with Supabase"
git push origin main
```

> [!IMPORTANT]
> Confirm `.gitignore` excludes `backend/.env`, `backend/*.db`, and `frontend/.env.local` before pushing.

---

## 🗄️ Phase 1: Set Up Supabase (Database)

### 1.1 Create a project
1. Go to [supabase.com](https://supabase.com) → Sign in → **New Project**
2. Fill in:
   - **Name:** `portfolio-backend`
   - **Database Password:** Choose a strong password — save it!
   - **Region:** `South Asia (Mumbai)` or nearest
3. Wait ~1 min for provisioning

### 1.2 Create tables
Go to **SQL Editor** and run:

```sql
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    tech_stack VARCHAR,
    github_link VARCHAR,
    live_demo VARCHAR
);

CREATE TABLE IF NOT EXISTS bug_reports (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR NOT NULL,
    issue_title VARCHAR NOT NULL,
    description TEXT NOT NULL,
    severity VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS feedback (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 1.3 Copy your connection string
1. **Settings → Database → Connection string → URI tab**
2. Copy & replace `[YOUR-PASSWORD]`:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxx.supabase.co:5432/postgres
   ```
3. Save this — you'll need it in Phase 2.

---

## ⚙️ Phase 2: Deploy Backend to Render

### 2.1 Create a Web Service
1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect your GitHub account and select **`ayusohm432.github.io`**
3. Configure:

| Setting | Value |
|---|---|
| **Name** | `portfolio-api` |
| **Region** | Closest to you |
| **Branch** | `main` |
| **Root Directory** | `backend` ⚠️ critical |
| **Runtime** | Python |
| **Build Command** | `pip install -r requirements.txt` |
| **Start Command** | `uvicorn main:app --host 0.0.0.0 --port $PORT` |
| **Instance Type** | Free |

### 2.2 Add environment variables
Before clicking Deploy, go to **Advanced → Add Environment Variable** and add both:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Supabase connection string from Phase 1.3 |
| `RENDER_EXTERNAL_URL` | Your pending Render URL (e.g. `https://portfolio-api-xyz.onrender.com`) |

> [!NOTE]
> `RENDER_EXTERNAL_URL` powers the keep-alive ping that prevents Render's free tier from sleeping.
> You can find your URL in the top-left of the Render dashboard after the service is created.

### 2.3 Deploy
Click **Deploy Web Service**. Watch the logs — when you see `Application startup complete`, the backend is live.

**Copy your live Render URL** — you'll need it in Phase 3.

### 2.4 Verify backend
Open your Render URL in the browser:

```
https://portfolio-api-xyz.onrender.com/projects
```

You should see all 7 projects returned as JSON (auto-seeded on first request).

---

## 🔗 Phase 3: Connect Frontend to Backend

### 3.1 Add GitHub Secret
1. Open your `ayusohm432.github.io` repo on GitHub
2. **Settings → Secrets and variables → Actions → New repository secret**
3. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** Your Render URL (e.g. `https://portfolio-api-xyz.onrender.com`)
   *(no trailing slash)*

This secret gets injected by GitHub Actions into the Vite build automatically.

---

## 🌐 Phase 4: Deploy Frontend to GitHub Pages

### 4.1 Enable GitHub Pages
1. In your repo → **Settings → Pages**
2. Under **Build and deployment**, set **Source** to **GitHub Actions**

### 4.2 Trigger the deployment
1. Go to the **Actions** tab in your repo
2. Select **Deploy Frontend to GitHub Pages** workflow
3. Click **Run workflow → Run workflow** (green button)
4. Wait ~2 minutes for ✅

### 4.3 Verify frontend
Visit: **`https://ayusohm432.github.io/`**

---

## ✅ Phase 5: End-to-End Verification

Run through each of these checks:

- [ ] **Projects load** on the Projects section (coming from Supabase via Render)
- [ ] **Bug Report modal** opens on a project → submit one → check `/admin`
- [ ] **Feedback modal** opens → submit one → check `/admin`
- [ ] **Contact form** submits → check `/admin`
- [ ] **`/admin` dashboard** at `https://ayusohm432.github.io/admin` shows all 3 tabs with data
- [ ] **`/issues` board** at `https://ayusohm432.github.io/issues` shows submitted bug reports
- [ ] Check **Supabase → Table Editor** — `bug_reports`, `feedback`, `contact_messages` tables have the rows you submitted

---

## 🔄 Future Deployments

After your initial setup, future updates are **fully automatic**:

```
git push origin main
```

→ GitHub Actions picks up the push  
→ Builds the React frontend with `VITE_API_URL` injected  
→ Deploys to GitHub Pages automatically  

For **backend changes**, Render auto-deploys on push to `main` as well (if you enabled auto-deploy in Render settings).

---

## 🧭 URL Reference

| Resource | URL |
|---|---|
| Portfolio | `https://ayusohm432.github.io/` |
| Admin Dashboard | `https://ayusohm432.github.io/admin` |
| Issue Board | `https://ayusohm432.github.io/issues` |
| Backend API | `https://portfolio-api-xyz.onrender.com` |
| API Docs (Swagger) | `https://portfolio-api-xyz.onrender.com/docs` |
| Supabase Studio | `https://supabase.com/dashboard/project/YOUR_ID/editor` |

---

## 🛠️ Troubleshooting

| Problem | Fix |
|---|---|
| Projects section shows no data | Check Render logs; verify `DATABASE_URL` is set correctly |
| `CORS` errors in browser console | Render backend is starting up (cold start ~30s on free tier) |
| GitHub Actions build fails | Check that `VITE_API_URL` secret is set in repo settings |
| `/admin` shows backend offline | Render may be sleeping — wait 30s and refresh |
| Supabase connection error | Verify password in connection string has no special chars that need URL-encoding |
| Old projects missing | Hit `/projects` endpoint once — the upsert seeder runs on every request |
