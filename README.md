# [Skateshop13](https://skateshop13.vercel.app/)

This is an open source e-commerce skateshop build with everything new in Next.js 13. It is bootstrapped with `create-t3-app`.

[![Skateshop13](./public/screenshot.png)](https://skateshop13.vercel.app/)

> **Warning**
> This project is still in development and is not ready for production use.
>
> It uses new technologies (server actions, drizzle ORM) which are subject to change and may break your application.

## Tech Stack

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Clerk Auth](https://clerk.dev)
- [Drizzle ORM](https://orm.drizzle.team)
- [React Email](https://react.email)
- [uploadthing](https://uploadthing.com)
- [Stripe](https://stripe.com)

## Features

- Authentication with Clerk
- File uploads with uploadthing
- Newsletter subscription with React Email and Resend
- Subscription, payment, and billing with Stripe
- Storefront with products and categories
- Seller and customer workflows
- Admin dashboard with stores, products, orders, subscriptions, and payments

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/sadmann7/skateshop
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Create a `.env` file

Create a `.env` file in the root directory and add the environment variables as shown in the `.env.example` file.

### 4. Run the application

```bash
pnpm run dev
```

### 5. Push database

```bash
pnpm run db:push
```

### 6. Listen for stripe events

```bash
pnpm run stripe:listen
```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
