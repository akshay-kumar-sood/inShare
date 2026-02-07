# Deploy inShare to Render

This guide walks you through deploying the inShare file-sharing app to Render.

## Prerequisites

- [Render](https://render.com) account
- [MongoDB Atlas](https://www.mongodb.com/atlas) (free tier)
- [GitHub](https://github.com) repository with your code
- Gmail with [App Password](https://myaccount.google.com/apppasswords) (2FA required)

---

## Step 1: Push Code to GitHub

1. Create a new repository on GitHub (e.g. `inshare` or `tap2send`).
2. Push your project to GitHub:

   ```bash
   cd d:\Tap2Sendhope
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. Make sure `.env` is in `.gitignore` and never committed.

---

## Step 2: Create Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com/).
2. Click **New** → **Web Service**.
3. Connect your GitHub account and select your repository.
4. Configure:
   - **Name**: `inshare` (or any name you prefer)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend` *(important – your server is in the backend folder)*
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

---

## Step 3: Environment Variables

In the Render service, go to **Environment** and add:

| Key | Value | Required |
|-----|-------|----------|
| `APP_BASE_URL` | `https://YOUR-APP-NAME.onrender.com` | **Yes** – Replace with your actual Render URL |
| `MONGO_CONNECTION_URL` | `mongodb+srv://user:password@cluster0.xxx.mongodb.net/?retryWrites=true&w=majority` | **Yes** |
| `MAIL_USER` | Your Gmail address (e.g. `you@gmail.com`) | **Yes** |
| `MAIL_PASSWORD` | Gmail [App Password](https://myaccount.google.com/apppasswords) (no spaces) | **Yes** |
| `SMTP_HOST` | `smtp.gmail.com` | No (default) |
| `SMTP_PORT` | `587` | No (default) |
| `ALLOWED_CLIENTS` | `https://YOUR-APP-NAME.onrender.com` | Optional – CORS origins |
| `NODE_ENV` | `production` | Optional |

### Important

- **APP_BASE_URL** must be exactly your Render URL, e.g. `https://inshare-xxxx.onrender.com` (no trailing slash).
- After creating the service, copy the URL from the dashboard and set `APP_BASE_URL` to that value.

---

## Step 4: MongoDB Atlas

1. Create a [MongoDB Atlas](https://www.mongodb.com/atlas/database) cluster (free tier).
2. Under **Network Access**, add `0.0.0.0/0` to allow connections from anywhere (Render’s IPs vary).
3. Create a database user with a password.
4. In **Database** → **Connect** → **Connect your application**, copy the connection string.
5. Replace `<password>` with your user password and use this as `MONGO_CONNECTION_URL`.

---

## Step 5: Deploy

1. Click **Create Web Service**.
2. Render will build and deploy. First deploy may take a few minutes.
3. After deploy, open your app URL (e.g. `https://inshare-xxxx.onrender.com`).
4. Update `APP_BASE_URL` if you only just got the final URL, then redeploy.

---

## Optional: Cron Job for Cleanup

To delete files older than 24 hours:

1. Go to **New** → **Cron Job**.
2. Connect the same repo.
3. **Root Directory**: `backend`
4. **Build Command**: `npm install`
5. **Start Command**: `npm run cleanup`
6. **Schedule**: `0 * * * *` (every hour) or `0 0 * * *` (daily at midnight).
7. Add the same environment variables (at least `MONGO_CONNECTION_URL`).

---

## Notes

- **Free tier** services spin down after 15 minutes of inactivity. First request after that may take 30–60 seconds.
- **Uploaded files** are stored on the server filesystem. On Render’s free tier, the disk is ephemeral, so files are lost on restart. For production, consider [Render Disks](https://render.com/docs/disks) or cloud storage (e.g. S3).
- Your app URL will be something like `https://inshare-xxxx.onrender.com`.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Email links show localhost | Set `APP_BASE_URL` to your Render URL and redeploy. |
| 535 Bad credentials (Gmail) | Use an App Password, not your normal Gmail password. Remove spaces from the password. |
| MongoDB connection failed | Check Network Access allows `0.0.0.0/0` and the connection string is correct. |
| 404 on routes | Ensure **Root Directory** is set to `backend`. |
