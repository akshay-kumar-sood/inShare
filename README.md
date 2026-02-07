# InShare – File Sharing Made Easy

Share files via link or email. Files expire after 24 hours.

## Project Structure

```
Tap2Sendhope/
├── backend/          # Node.js / Express server
│   ├── server.js     # Entry point
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── views/
│   └── uploads/
├── frontend/         # Static files (HTML, CSS, JS, images)
│   ├── index.html
│   ├── index.js
│   ├── css/
│   └── img/
└── RENDER_DEPLOYMENT.md  # Render hosting guide
```

## Run Locally

1. **Copy environment variables**

   ```bash
   cd backend
   copy .env.example .env
   ```

   Edit `.env` with your MongoDB URL, Gmail App Password, etc.

2. **Install and start**

   ```bash
   cd backend
   npm install
   npm start
   ```

3. Open http://localhost:3000

## Deploy to Render

See **[RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md)** for full steps and environment variables.

**Quick checklist:**
- Set **Root Directory** to `backend`
- Set `APP_BASE_URL` to your Render URL (e.g. `https://your-app.onrender.com`)
- Add `MONGO_CONNECTION_URL`, `MAIL_USER`, `MAIL_PASSWORD`

## Footer Links

Update GitHub and LinkedIn URLs in `frontend/index.html`:

```html
<a href="https://github.com/kumarakshaysood" ...>GitHub</a>
<a href="https://linkedin.com/in/kumarakshaysood" ...>LinkedIn</a>
```

Replace with your own profile URLs if needed.
