# Hasnat Portfolio — AI-Powered Developer Platform

A production-ready full-stack portfolio built with **Next.js 16**, **TypeScript**, **Tailwind CSS**, **Prisma**, **PostgreSQL**, and **OpenAI**.

## Features

- **Public portfolio** — Projects, blog, skills, services, testimonials, resume, contact
- **Admin dashboard** — Secure CMS with CRUD for all content
- **AI Portfolio Assistant** — Chat that reads live from your database
- **AI Job Match** — Job description vs profile analysis
- **Contact system** — Messages in admin + optional Resend email
- **Analytics** — Page views, AI usage, device stats
- **SEO** — Sitemap, robots.txt, Open Graph

## Quick Start

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

- Public: http://localhost:3000
- Admin: http://localhost:3000/admin/login

## Environment Variables

See `.env.example` for `DATABASE_URL`, `NEXTAUTH_SECRET`, `OPENAI_API_KEY`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`.

## Architecture

- `src/app/(public)/` — Visitor-facing pages (SSR)
- `src/app/admin/(panel)/` — Protected CMS
- `src/lib/ai.ts` — Dynamic portfolio context for AI (queries PostgreSQL)
- `prisma/schema.prisma` — All content models

Legacy static site preserved in `legacy/`.
