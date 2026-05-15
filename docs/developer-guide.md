# LocalMart Developer Guide

## Project Structure
To ensure scalability and maintainability, the project follows a modular architecture.

```text
LocalMart/
├── frontend/               # Next.js 14 App Router (Client)
│   ├── src/app/            # Page routing and layouts
│   ├── src/components/     # Atomic UI components
│   ├── src/hooks/          # Custom React hooks (e.g., useAuth, useCart)
│   └── src/lib/            # API clients, Supabase client, utilities
├── backend/                # Node.js + Express.js (Server)
│   ├── src/controllers/    # Business logic for each module
│   ├── src/routes/         # API endpoint definitions
│   ├── src/middlewares/    # Auth, Validation, Error handling
│   ├── src/services/       # External integrations (Razorpay, AWS S3, OpenAI)
│   └── src/utils/         # Common helpers
├── shared/                 # Shared Types & Constants
│   ├── types/              # TypeScript interfaces (User, Product, Order)
│   └── constants/          # Error codes, Enums, Config keys
└── docs/                    # Project Documentation
    ├── LocalMart_PRD_v1.1.md # Product Requirements
    └── schema.sql           # Database DDL
```

---

## API Specifications (Phase 1: Core Flows)

All endpoints are versioned under `/api/v1`. 
**Authentication:** All protected routes require a `Authorization: Bearer <JWT>` header.

### 1. Authentication Module
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/auth/register` | `POST` | Create new account (Buyer/Seller) | Public |
| `/auth/login` | `POST` | Authenticate and receive JWT | Public |
| `/auth/verify-otp` | `POST` | Verify 6-digit phone/email OTP | Public |
| `/auth/me` | `GET` | Get current user profile | Authenticated |
| `/auth/logout` | `POST` | Invalidate session/token | Authenticated |

### 2. Product & Discovery Module
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/products` | `GET` | Search/List products (Filters: cat, price, distance) | Public |
| `/products/semantic` | `GET` | Vector-based search (query $\rightarrow$ embeddings) | Public |
| `/products/:id` | `GET` | Fetch detailed product info | Public |
| `/products` | `POST` | Create new listing (Seller only) | Seller |
| `/products/:id` | `PATCH` | Update listing details | Seller |
| `/ai/generate-desc` | `POST` | Generate AI product description | Seller |

### 3. Cart & Order Module (The Escrow Flow)
| Endpoint | Method | Description | Access |
| :--- | :--- | :--- | :--- |
| `/cart` | `GET` | Fetch current user's cart | Buyer |
| `/cart/add` | `POST` | Add product variant to cart | Buyer |
| `/orders` | `POST` | Place order $\rightarrow$ Create `held` payment | Buyer |
| `/orders/:id` | `GET` | Track order status and delivery | Buyer/Seller |
| `/orders/:id/confirm`| `POST` | Confirm receipt $\rightarrow$ Trigger `released` payment | Buyer |
| `/orders/:id/status` | `PATCH` | Update status (e.g., Packed $\rightarrow$ Shipped) | Seller |

---

## Getting Started
1. **Database**: Run the SQL in `docs/schema.sql` in your Supabase SQL Editor.
2. **Backend**:
   - `cd backend`
   - `npm install`
   - Setup `.env` (SUPABASE_URL, SUPABASE_KEY, RAZORPAY_KEY, OPENAI_KEY)
   - `npm run dev`
3. **Frontend**:
   - `cd frontend`
   - `npm install`
   - `npm run dev`
