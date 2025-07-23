# OhmMade Admin Dashboard

This is the admin dashboard for the OhmMade platform, accessible at `admin.ohmmade.ca`.

## Features

- User management
- Project moderation
- Analytics dashboard
- Platform settings

## Development

### Prerequisites

- Node.js 18+
- pnpm
- Access to the shared Prisma database

### Setup

1. Install dependencies:

    ```bash
    pnpm install
    ```

2. Set up environment variables:
   Create a `.env.local` file with:

    ```
    DATABASE_URL=your_database_url
    DIRECT_URL=your_direct_database_url
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ```

3. Run the development server:
    ```bash
    pnpm dev
    ```

The admin dashboard will be available at `http://localhost:3001` (or the next available port).

## Authentication

The admin dashboard uses Supabase authentication. Currently, admin access is granted to:

- Users with `@ohmmade.ca` email addresses
- The specific email `admin@ohmmade.ca`

You can modify the admin check logic in `/api/auth/check-admin/route.js`.

## Deployment

The admin app is configured to be deployed as a separate subdomain (`admin.ohmmade.ca`) and is included in the turborepo build pipeline.

## Structure

- `/app` - Next.js app directory
- `/app/api` - API routes
- `/app/auth` - Authentication pages
- `/prisma` - Database client configuration
- `/public` - Static assets
