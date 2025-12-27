# AI Coding Agent Instructions

## Architecture Overview
This is a multi-tenant social media service marketplace built with Next.js 15+ using the app router. The app has three main sections:
- **Public landing page** (`app/(root)`) - Marketing site with hero, services showcase, testimonials
- **Client dashboard** (`app/client`) - User-facing order management and account features
- **Admin panel** (`app/admin`) - Store management, analytics, service configuration

Key architectural patterns:
- Route groups for logical separation (admin, client, public)
- Higher-order component `withAuth` for authentication guards
- Global context (`appContext`) for user state, API client, and store settings
- React Query hooks in `/hooks` for all data fetching and mutations
- shadcn/ui components with Tailwind CSS for consistent UI

## Authentication & Authorization
- Use `withAuth` HOC to protect routes: `withAuth({ WrappedComponent: MyComponent, userType: "admin" | "user", excludePaths: [...] })`
- Auth state managed in `appContext` with separate `userInfo` and `adminInfo`
- Public paths in client section: `/client/services`, `/client/faq`, `/client/blog`, `/client/api-docs`

## Data Fetching Patterns
- All API calls through React Query hooks in `/hooks` (e.g., `useGetServicesByPublic`, `useCreateService`)
- Query keys include `storeId` for multi-tenancy: `["servicesByPublic", storeId]`
- Mutations invalidate related queries and show toast notifications
- API client available via `useAppContext().api` (axios instance)

## Component Patterns
- UI components in `/components/ui` follow shadcn/ui conventions with `cva` for variants
- Layout components use `SidebarProvider` and `SidebarInset` for responsive sidebars
- Memoize heavy components (e.g., sidebars) to prevent unnecessary re-renders
- Use `Wrapper` component for consistent max-width containers

## File Organization
- Types: `/types/models/` for data models, `/types/index.ts` for exports
- Utilities: `/lib/` for helpers, currency conversion, auth logic
- Context: `/context/` for global state management
- Providers: `/provider/` for React Query and theme setup

## Development Workflow
- Start dev server: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint`
- No test suite currently configured
- Debug API calls in browser network tab; state in React DevTools

## Adding New Features
- For new services: Add to `/types/models/service.ts`, create hook in `/hooks/use-services.tsx`, update admin/client pages
- For new pages: Follow route group structure, wrap with `withAuth` if protected
- For new components: Use shadcn/ui patterns, place in appropriate subfolder under `/components`

## Key Files to Reference
- `app/layout.tsx` - Root providers setup
- `context/appContext.tsx` - Global state and API client
- `hooks/use-services.tsx` - Data fetching example
- `components/ui/button.tsx` - Component variant pattern
- `lib/withAuth.tsx` - Authentication HOC</content>
<parameter name="filePath">/Users/mac/Documents/Projects/social-media-store-frontend/.github/copilot-instructions.md