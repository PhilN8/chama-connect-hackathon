# ChamaConnect Hackathon Submission

Theme: Reimagining Digital Chamas for the Future

Repository: https://github.com/PhilN8/chama-connect-hackathon
Live Site: https://chama-connect-hackathon.vercel.app/

## Local Development

Install dependencies:

```bash
pnpm install
```

Run development server:

```bash
pnpm dev
```

Run database push (creates tables):

```bash
pnpm db:push
```

Seed demo data (2 users, 4 chamas, ~50 members, 2M+ KES contributions):

```bash
pnpm db:seed
```

Run production build check:

```bash
pnpm build
```

---

## Overview

This project addresses challenges and bugs in chama management workflows, focusing on authentication, onboarding, and contribution tracking. Built with Next.js 16, ShadCN, and Better-Auth.

---

## Implemented Features

### Authentication (Better-Auth)

- **Sign up** → email verification sent automatically
- **Login** → email/password with HttpOnly secure cookies
- **Change password** → authenticated endpoint with current password verification
- **Change email** → sends verification link to new email
- **Session management** → server-side with cookie cache, 7-day expiry

### Profile Management

- **Info tab** → display name, email, phone, role, member since date
- **Security tab** → change password with show/hide toggle
- **Email tab** → change email with verification flow
- **Invite tab** → invite members to chama with role selection (Admin/Treasurer/Secretary/Member)

### Chama Creation

- Creator automatically becomes **ADMIN** in `chamaMemberships`
- Members can be invited with specific roles
- Pending invitations expire after 48 hours
- Existing users are added directly to chama

### Dashboard

- **Overview** → KPIs for members, contributions, growth rate
- **Members** → searchable, sortable, filterable table with role badges
- **Contributions** → full analytics with date range, amount range, status filters
- **Onboard Chama** → multi-step onboarding flow
- **Profile** → full account management

### Database (Drizzle ORM + SQLite)

- Real relational data (not in-memory)
- Tables: `users`, `sessions`, `chamas`, `chama_memberships`, `invitations`, `contributions`
- Seed script creates realistic demo data

---

## Routes

| Route | Type | Description |
|-------|------|-------------|
| `/` | Static | Landing page |
| `/sign-in` | Dynamic | Login page |
| `/sign-up` | Dynamic | Registration page |
| `/onboard-chama` | Dynamic | Public onboarding (redirects to dashboard if logged in) |
| `/contact` | Static | Contact form |
| `/dashboard` | Dynamic | Dashboard overview |
| `/dashboard/members` | Dynamic | Members table |
| `/dashboard/contributions` | Dynamic | Contributions analytics |
| `/dashboard/onboard-chama` | Dynamic | Protected onboarding |
| `/dashboard/profile` | Dynamic | Account settings |

---

## Tech Stack

- **Next.js 16** (App Router, Turbopack)
- **TypeScript**
- **Tailwind CSS v4** + ShadCN components
- **Better-Auth** for authentication
- **Drizzle ORM** with SQLite
- **TanStack Query** for server state
- **TanStack Table** for data tables
- **React Hook Form** + **Zod** for validation
- **Sonner** for toast notifications
- **Framer Motion** for animations

---

## API Endpoints

### Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/profile/update` | Update name/phone |
| PUT | `/api/profile/change-password` | Change password |
| PUT | `/api/profile/change-email` | Send email verification |
| POST | `/api/profile/invite` | Invite member to chama |
| POST | `/api/profile/accept-invitation` | Accept invitation |

### Chama

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chama/create` | Create new chama |
| GET | `/api/chama/search` | Search existing SACCOs |

---

## Data Model

```
users (Better-Auth)
  └── globalRole: USER | SYSTEM_ADMIN
  └── phoneNumber

chamas
  └── name, description, minContributionAmount

chama_memberships (user <-> chama relation with role)
  └── role: ADMIN | TREASURER | SECRETARY | MEMBER
  └── status: ACTIVE | DEACTIVATED | PENDING

invitations
  └── email, role, status: PENDING | ACCEPTED | EXPIRED
  └── expiresAt (48h)

contributions
  └── amount, paymentMethod: CASH | MPESA
  └── status: PENDING | VERIFIED | REJECTED | SELF_VERIFIED
```

---

## Demo Credentials

Seed with `pnpm db:seed` to get:

| Account | Email | Password |
|---------|-------|----------|
| User 1 | wajahiru.kamau@chamaconnect.io | Password@123 |
| User 2 | odhiambo.okoth@chamaconnect.io | Password@456 |

Each user has 2 chamas with 10-20 members each. Contributions total over **2M KES** across 3 years.

---

## Notes for Judges

1. Run `pnpm db:seed` to populate demo data
2. Sign in with demo credentials to see fully populated dashboards
3. New users see empty states and can complete full onboarding
4. Profile section allows password/email changes and member invites
5. All contribution statuses are realistic (mostly VERIFIED with some PENDING)