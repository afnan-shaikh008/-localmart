# 🚀 LocalMart Deployment Guide

This guide provides a step-by-step walkthrough for deploying the LocalMart marketplace to production.

## 🏗️ High-Level Architecture
- **Frontend**: Vercel (Next.js)
- **Backend**: Render / Railway / AWS EC2 (Node.js)
- **Database & Auth**: Supabase (PostgreSQL)
- **AI**: OpenAI API
- **Payments**: Razorpay

---

## Step 1: Database Setup (Supabase)
Your project relies on specific PostgreSQL extensions for AI and Location features.

1.  **Create a Project**: Sign up at [supabase.com](https://supabase.com) and create a new project.
2.  **Enable Extensions**: Go to the **SQL Editor** and run:
    ```sql
    CREATE EXTENSION IF NOT EXISTS postgis;
    CREATE EXTENSION IF NOT EXISTS vector;
    ```
3.  **Execute Schema**: Copy the SQL DDL from `docs/schema.sql` (or the latest plan file) and run it in the SQL Editor to create all tables, enums, and RLS policies.
4.  **Get Credentials**: Go to `Project Settings` $\rightarrow$ `API` and copy:
    - `Project URL`
    - `service_role` key (Secret key for backend)
    - `anon` key (Public key for frontend)

---

## Step 2: Backend Deployment (Render / Railway)
We recommend **Render** or **Railway** for the Node.js API due to their ease of use.

1.  **Push to GitHub**: Create a private repository and push the `backend/` folder.
2.  **Deploy**:
    - Connect your GitHub repo to the platform.
    - **Build Command**: `npm install && npm run build` (if using TS build) or just `npm install`.
    - **Start Command**: `npm run dev` (or `node dist/index.js` after build).
3.  **Environment Variables**: In the platform's "Environment" tab, add:
    - `PORT`: `5000`
    - `SUPABASE_URL`: (Your project URL)
    - `SUPABASE_SERVICE_ROLE_KEY`: (Your service role key)
    - `JWT_SECRET`: (A long random string)
    - `RAZORPAY_KEY_ID`: (From Razorpay Dashboard)
    - `RAZORPAY_KEY_SECRET`: (From Razorpay Dashboard)
    - `OPENAI_API_KEY`: (From OpenAI Platform)

---

## Step 3: Frontend Deployment (Vercel)
Next.js is optimized for Vercel.

1.  **Push to GitHub**: Push the `frontend/` folder to a separate repo (or a monorepo).
2.  **Deploy**:
    - Import the project into Vercel.
    - **Framework Preset**: Next.js.
3.  **Environment Variables**: Add the following in Vercel's Project Settings:
    - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.com/api/v1`
    - `NEXT_PUBLIC_SUPABASE_URL`: (Your project URL)
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: (Your anon key)

---

## Step 4: Final Production Checklist

### ✅ 1. Domain & SSL
- Set up a custom domain (e.g., `localmart.in`) via Vercel and Render.
- Ensure HTTPS is enforced on all endpoints.

### ✅ 2. Razorpay Webhooks
- Configure a Webhook in the Razorpay Dashboard to listen for `payment.captured`.
- Point the webhook to your backend: `https://your-backend-url.com/api/v1/payments/webhook`.

### ✅ 3. AI Fine-tuning
- Update the prompt in `aiController.ts` if you want to change the "voice" or "tone" of the AI descriptions based on user feedback.

### ✅ 4. Supabase RLS Check
- Test the application with a "Buyer" and "Seller" account to ensure that a Buyer cannot edit a Product and a Seller cannot release their own escrow funds.

---

## 🛠️ Troubleshooting
- **CORS Errors**: If the frontend cannot call the backend, check the `cors()` configuration in `backend/src/index.ts`. Ensure the Vercel URL is whitelisted.
- **Vector Search Failures**: Ensure the `match_products` RPC function is created in Supabase. If missing, the semantic search will return 500.
- **Payment Issues**: Ensure you are using "Test Mode" in Razorpay before switching to "Live Mode".
