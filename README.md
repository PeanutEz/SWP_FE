# PayOS Frontend (Vite + React + TS)

A minimal React frontend to create PayOS payment links using your backend.

## Prerequisites

-   Node.js 18+

## Configure

Create `.env` (already added):

```
VITE_API_BASE_URL=http://localhost:4000
```

Ensure your backend exposes:

-   POST /api/payment/create-payment

## Run (Windows PowerShell)

```
# Install deps
npm install

# Start dev server at http://localhost:3000
npm run dev
```

## How it works

-   Payment form posts amount/description to your backend.
-   On success, it redirects the browser to the returned checkout URL (accepts different key names: checkoutUrl, checkout_url, paymentUrl, payUrl, shortLink).

## Routes

-   `/` — payment form
-   `/payment-success` — success page
-   `/payment-cancel` — cancel page
