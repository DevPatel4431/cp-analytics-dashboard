# CP Analytics Dashboard

A simple static dashboard for competitive programmers to track upcoming Codeforces contests and view quick Codeforces/LeetCode profile stats.

## Features

- Fetches upcoming Codeforces contests
- Converts contest time to IST
- Opens contest registration links directly
- Shows Codeforces stats (rating, rank, solved, friend count, max rating)
- Shows LeetCode stats (ranking, total solved, easy/medium/hard)
- Includes Sign In / Sign Up UI pages (frontend only)

## Stack

- HTML, CSS, JavaScript
- jQuery (signup form validation)
- Codeforces API + public LeetCode stats API

## Run Locally

```bash
git clone https://github.com/DevPatel4431/cp-analytics-dashboard.git
cd cp-analytics-dashboard
```

Open `index.html` in your browser (or run with Live Server).

## Quick Config

Edit handles in `script.js`:

- Codeforces: `DBP_Heaven`
- LeetCode: `devpatel_14`

## Notes

- No backend authentication yet
- Basic error handling (mostly console logs)