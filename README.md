# [Skateshop13](https://skateshop13.vercel.app/)

This is an open source e-commerce skateshop build with everything new in Next.js 13 (App router, rsc, server action, vercel postgres with prisma). It is bootstrapped with `create-t3-app`.

[![Skateshop13](./public/screenshot.png)](https://skateshop13.vercel.app/)

[![Skateshop13](./public/screenshot.png)](https://skateshop13.vercel.app/)

## Tech Stack

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [uploadthing](https://uploadthing.com)
- [Stripe](https://stripe.com)

## Features

- Authentication with NextAuth.js
- Subscription with Stripe
- Store and product CRUD operations for individual users with server action, Prisma
- Image upload with uploadthing
- Dynamic product table component made with TanStack Table with serve side pagination

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

### 5. Listen for stripe events

```bash
pnpm run stripe:listen
```

## How do I deploy this?

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.
