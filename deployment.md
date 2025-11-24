# Deployment Guide & Cost Estimate

To deploy your Voice Call App, you need to host two parts:
1.  **Frontend (Client)**: The React interface.
2.  **Backend (Server)**: The Node.js signaling server.

## Recommended Hosting Strategy

### 1. Frontend: Vercel or Netlify (Free)
These platforms are optimized for React apps.
-   **Cost**: Free for personal use.
-   **Setup**: Connect your GitHub repository. It automatically detects Vite and builds your site.

### 2. Backend: Render or Railway (Free / Low Cost)
Since you need a persistent WebSocket connection, you cannot use "Serverless" functions (like Vercel Functions). You need a real server.
-   **Render**: Offers a free tier for web services (spins down after inactivity).
-   **Railway**: Offers a trial, then pay-as-you-go.
-   **Heroku**: No longer has a free tier (starts ~$5/mo).

## Step-by-Step Deployment

### Step 1: Prepare for Production
1.  **Update Client URL**: In `client/src/App.jsx`, change the socket connection from `localhost:5000` to your deployed backend URL (e.g., `https://my-voice-app-backend.onrender.com`).
    ```javascript
    const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');
    ```
2.  **Push to GitHub**: Create a repository and push your code.

### Step 2: Deploy Backend (Render.com Example)
1.  Create a new "Web Service" on Render.
2.  Connect your GitHub repo.
3.  Set Root Directory to `server`.
4.  Set Build Command: `npm install`.
5.  Set Start Command: `node server.js`.
6.  **Cost**: Free (Free tier) or $7/month (Starter).

### Step 3: Deploy Frontend (Vercel Example)
1.  Create a new project on Vercel.
2.  Connect your GitHub repo.
3.  Set Root Directory to `client`.
4.  Add Environment Variable: `VITE_SERVER_URL` = Your Render Backend URL.
5.  Deploy.
6.  **Cost**: Free.

## Cost Breakdown

| Component | Service | Tier | Estimated Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | Vercel / Netlify | Hobby | **$0 / month** |
| **Backend** | Render | Free | **$0 / month** (Sleeps after 15m inactivity) |
| **Backend** | Render | Starter | **$7 / month** (Always on) |
| **Backend** | Heroku | Eco/Basic | **~$5-7 / month** |
| **TURN Server** | Metered.ca / Twilio | Free/Pay-as-you-go | **$0** (for low usage) |

> [!IMPORTANT]
> **TURN Server**: For a production app that works on *all* networks (like corporate firewalls or mobile data), you will eventually need a TURN server. The current `simple-peer` setup uses free public STUN servers (Google's). This works for ~80% of connections. For 100% reliability, you'd need a paid TURN service (e.g., Twilio Network Traversal), which costs ~$0.40/GB of data.

## Summary
-   **Minimum Cost**: **$0/month** (using free tiers).
-   **Reliable Production Cost**: **~$7/month** (for an always-on backend).
