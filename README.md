# API Cost Tracker

A production-ready SaaS webapp for tracking API costs across multiple providers (OpenAI, Anthropic, Stripe, etc.).

## Features

- **Real-time Cost Tracking**: Monitor spending across all API providers
- **Usage Analytics**: Daily, weekly, and monthly usage charts
- **Smart Alerts**: Get notified when hitting budget thresholds
- **Secure Storage**: API keys encrypted with AES-256-GCM
- **Auto-sync**: Usage data syncs every 6 hours
- **Multi-provider Support**: OpenAI, Anthropic, Stripe, and custom APIs

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account
- A Stripe account (for billing)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/api-cost-tracker.git
cd api-cost-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Encryption (generate with: openssl rand -hex 32)
ENCRYPTION_KEY=your_32_byte_hex_key

# Cron (for Vercel cron jobs)
CRON_SECRET=your_cron_secret
```

5. Set up the database:
   - Go to your Supabase dashboard
   - Open the SQL Editor
   - Run the contents of `supabase/schema.sql`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Database Setup

Run the SQL schema in your Supabase SQL Editor:

```sql
-- See supabase/schema.sql for full schema
```

### Stripe Setup

1. Create a product and price in Stripe Dashboard
2. Set `STRIPE_PRO_PRICE_ID` to your price ID
3. Set up webhook endpoint pointing to `/api/stripe/webhook`
4. Configure webhook to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Deployment

### Vercel

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

The `vercel.json` includes cron configuration for auto-syncing every 6 hours.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── alerts/       # Alerts CRUD
│   │   ├── cron/         # Scheduled sync
│   │   ├── providers/    # API providers CRUD
│   │   ├── stripe/       # Billing webhooks
│   │   ├── sync/         # Manual sync
│   │   └── usage/        # Usage data
│   ├── auth/             # Login/Signup
│   ├── dashboard/        # Protected pages
│   └── page.tsx          # Landing page
├── components/
│   ├── alerts/           # Alert components
│   ├── dashboard/        # Dashboard widgets
│   ├── providers/        # Provider management
│   └── ui/               # shadcn/ui components
├── lib/
│   ├── api-clients/      # OpenAI, Anthropic clients
│   ├── supabase/         # Supabase clients
│   ├── encryption.ts     # API key encryption
│   ├── stripe.ts         # Stripe config
│   └── utils.ts          # Helper functions
└── types/
    └── database.ts       # TypeScript types
```

## Pricing Tiers

| Feature | Free | Pro ($20/mo) |
|---------|------|--------------|
| API Providers | 2 | Unlimited |
| History | 30 days | 12 months |
| Email Alerts | No | Yes |
| CSV Export | No | Yes |

## License

MIT
