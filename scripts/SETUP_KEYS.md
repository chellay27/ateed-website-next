# API Key Setup Guide

This project uses several external APIs. Below are step-by-step instructions for obtaining each key.

---

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_PSI_API_KEY=AIza...
RESEND_API_KEY=re_...
AUDIT_NOTIFICATION_EMAIL=sales@ateedtech.com
```

---

## 1. `ANTHROPIC_API_KEY` — AI Chatbot

Used by the AI chat widget (`/api/chat`).

1. Go to [console.anthropic.com](https://console.anthropic.com/)
2. Sign in or create an account
3. Navigate to **API Keys** in the left sidebar
4. Click **Create Key**, give it a name (e.g., "ateed-website")
5. Copy the key — it starts with `sk-ant-`

**Pricing:** Pay-per-token. See [anthropic.com/pricing](https://www.anthropic.com/pricing).

---

## 2. `GOOGLE_PSI_API_KEY` — Website Audit (PageSpeed Insights)

Used by the Free Website Audit feature (`/api/audit`). Optional but strongly recommended — without it, you're limited to 25 requests/day instead of 25,000/day.

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services → Library**
4. Search for **PageSpeed Insights API** and click **Enable**
5. Go to **APIs & Services → Credentials**
6. Click **Create Credentials → API Key**
7. Copy the key — it starts with `AIza`
8. (Recommended) Click **Restrict Key** and limit it to the PageSpeed Insights API

**Pricing:** Free tier covers 25,000 requests/day.

---

## 3. `RESEND_API_KEY` — Email Notifications

Used to send audit result emails to the team and to users.

1. Go to [resend.com](https://resend.com/) and create an account
2. Navigate to **API Keys** in the sidebar
3. Click **Create API Key**, select **Sending access** permission
4. Copy the key — it starts with `re_`
5. **Important:** You must also verify your sending domain:
   - Go to **Domains** → **Add Domain**
   - Add `ateedtech.com` and follow the DNS record instructions
   - Until verified, you can only send from `onboarding@resend.dev`

**Pricing:** Free tier includes 100 emails/day, 3,000/month.

---

## 4. `AUDIT_NOTIFICATION_EMAIL` — Team Notification Recipient

This is not an API key — it's the email address where audit lead notifications are sent.

- Default: `sales@ateedtech.com`
- Change this to whatever inbox your sales/lead team monitors

---

## Verification

After setting all keys, run:

```bash
npm run dev
```

Test the audit feature:

```bash
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com","name":"Test","email":"test@test.com"}'
```

You should receive a JSON response with audit scores within 15-30 seconds.
