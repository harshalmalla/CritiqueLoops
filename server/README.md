# CritiqueLoop API

Backend for CritiqueLoop: accepts a portfolio submission, automatically pairs
it with the next person waiting, and lets each side leave feedback for the
portfolio they were matched with. No login — a submitter is identified only
by an opaque `token` returned at submit time and required on every later
request (send it as the `x-submission-token` header).

## Endpoints

| Method | Path                        | Auth              | Body                  |
| ------ | --------------------------- | ----------------- | ---------------------- |
| GET    | `/api/health`                | -                  | -                       |
| POST   | `/api/submissions`           | -                  | `{ portfolioUrl }`      |
| GET    | `/api/submissions/:id`       | `x-submission-token` | -                    |
| POST   | `/api/submissions/:id/review`| `x-submission-token` | `{ feedback }`       |
| POST   | `/api/contact`                | -                  | `{ email, message }`   |

`GET /api/submissions/:id` returns:

```json
{
  "status": "waiting | matched",
  "matchedPortfolioUrl": "https://example.com | null",
  "hasSubmittedReview": false,
  "feedbackReceived": [{ "feedback": "...", "createdAt": "..." }]
}
```

## Run locally

```bash
cd server
cp .env.example .env   # then fill in MONGODB_URI (see below)
npm install
npm run dev
```

The API listens on `http://localhost:4000` by default. The frontend's
`index.html` already points `window.CRITIQUELOOP_API_BASE_URL` at
`http://localhost:4000/api`, so you can open `index.html` directly in a
browser (or serve it) while this is running.

## 1. Create a free MongoDB Atlas cluster

1. Go to <https://www.mongodb.com/cloud/atlas/register> and create a free account (or sign in).
2. Create a new Project, then **Build a Database → M0 Free**.
3. Under **Security → Database Access**, add a database user with a username/password (autogenerate a strong password).
4. Under **Security → Network Access**, add `0.0.0.0/0` (allow access from anywhere) — Render's outbound IPs aren't static on the free plan, so this is the simplest option for a demo project.
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
   ```
6. Add a database name to the path, e.g. `.../critiqueloop?retryWrites=true...`, and put the whole string in `MONGODB_URI` (locally in `.env`, in production as a Render env var — see below). Fill in the real username/password in place of `<user>`/`<password>`.

## 2. Deploy the API on Render

This repo includes a `render.yaml` blueprint at the repo root, so Render can set it up automatically:

1. Push this repo to GitHub (Render deploys from a Git repo).
2. In the [Render dashboard](https://dashboard.render.com/), click **New → Blueprint**, and select this repo.
3. Render reads `render.yaml` and proposes a `critiqueloop-api` web service rooted at `server/`. It will prompt you for the one secret env var: `MONGODB_URI` — paste the Atlas connection string from step 1.
4. Deploy. Render builds with `npm install` and starts with `npm start`.
5. Once live, your API is at `https://<your-service-name>.onrender.com`. Check `https://<your-service-name>.onrender.com/api/health` returns `{"ok":true}`.
6. If your GitHub Pages URL differs from `https://harshalmalla.github.io`, update the `CORS_ORIGIN` env var on the Render service (Dashboard → your service → Environment) to match, or it'll reject the frontend's requests.

### Point the frontend at it

Open `../index.html` and change:

```html
window.CRITIQUELOOP_API_BASE_URL = "http://localhost:4000/api"
```

to your live Render URL, e.g.:

```html
window.CRITIQUELOOP_API_BASE_URL = "https://critiqueloop-api.onrender.com/api"
```

Commit and push — GitHub Pages will pick it up.

### Heads up: free-tier cold starts

Render's free web services spin down after ~15 minutes of inactivity and take
20-60 seconds to wake back up on the next request. The first portfolio
submission after a quiet period may feel slow — that's expected, not a bug.
