# Social Media Store Frontend AI Documentation

## 1. Project Overview
**Purpose**: Customer-facing and admin interface for SMM (Social Media Marketing) service marketplace. Handles service browsing, order placement, refill management, and analytics.
**Framework**: Next.js 15 (App Router) + React 19 + Tailwind CSS
**State Management**: React Query (TanStack Query) for server state + Context (AppContext) for app-level state.
**UI Library**: shadcn/ui (Radix-based) with custom components.
**Type**: Frontend Application (SMM Domain).

## 2. Directory Structure (Same as shop-frontend)

| Path | Purpose |
|---|---|
| `app/admin/*` | Admin dashboard routes (service management, orders, analytics). |
| `app/client/*` | Public storefront routes (services, order placement, tracking). |
| `components/` | Reusable React components (ServiceCard, OrderForm, etc.). |
| `hooks/` | Custom React hooks for API calls (use-service, use-order, etc.). |
| `context/` | Global state (AppContext). |
| `lib/` | Utility functions (currency conversion, auth helpers). |
| `types/` | TypeScript type definitions organized by domain. |
| `utils/` | Generic utilities (error normalization, API). |

## 3. Core Concepts (Same Pattern, SMM Domain)

### UI Consistency Workflow (Mandatory)

Before adding or changing UI:

1. Review baseline design from the home and pricing experiences in this frontend.
2. Inspect reusable components first:
  - `components/ui/`
  - `components/`
3. Reuse/extend existing components before introducing new ones.
4. Avoid native/raw form controls when a project component already exists for the same control type.

### AppContext - Global State
Same as shop-frontend:
- `api`: Axios instance preconfigured with auth token/headers.
- `storeId`: Current store identifier.
- `userInfo`: Authenticated customer.
- `adminInfo`: Authenticated store admin.

### React Query Hooks (SMM-Specific)
**Location**: `hooks/use-*.tsx`

Key hooks:
- `useGetServicesByPublic()`: Fetch public services.
- `useGetServicesByAdmin()`: Fetch all services (admin).
- `useGetServicesByProviderId(providerId)`: Filter by provider.
- `useCreateOrder()`: Place order for service.
- `useCreateBulkOrder()`: Batch order creation.
- `useGetOrderByStatus(status)`: Filter orders by status.
- `useGetUserRefills()`: Fetch auto-refill orders.

## 4. SMM-Specific Features

### Service Models
- **Service**: Social media action (e.g., Instagram Followers, TikTok Likes).
- **Provider**: External supplier (Airtm, SMM Panel, etc.).
- **Drip-Feed**: Gradual delivery over time.
- **Refill**: Auto-replenishment when count drops.

### Order Flow
```
Customer selects Service
  ↓
Fills in target URL (Instagram profile, TikTok video, etc.)
  ↓
Enters quantity (min/max validated)
  ↓
Optional: Enable drip-feed (gradual delivery)
  ↓
Optional: Enable refill (auto-replenishment)
  ↓
Confirm order
  ↓
Backend sends to Provider
  ↓
Frontend polls for status updates
```

### Admin Features
- Service CRUD (create, update, delete services).
- Link services to providers.
- Set pricing, min/max quantities.
- Enable drip-feed, refill, cancel options.
- Monitor orders and refunds.

## 5. Feature Implementation Pattern

### New Feature: "Service Analytics Tracking"

1. **Backend**: Ensure endpoint exists (`/v1/services/:serviceUid/analytics`).
2. **Type**: Define in `types/models/analytics.ts`:
   ```typescript
   export interface ServiceAnalytics {
     serviceUid: string;
     totalOrders: number;
     totalRevenue: number;
     avgOrderValue: number;
     completedOrders: number;
   }
   ```
3. **Hook**: Create `hooks/use-analytics.tsx`:
   ```typescript
   export const useGetServiceAnalytics = (serviceUid: string) => {
     const { api, storeId } = useAppContext();
     return useQuery({
       queryKey: ["serviceAnalytics", serviceUid, storeId],
       queryFn: async () => {
         const res = await api.get(`/services/${serviceUid}/analytics`);
         return res.data;
       },
       enabled: !!api && !!serviceUid,
     });
   };
   ```
4. **Component**: Use hook in analytics page:
   ```typescript
   const { data: analytics } = useGetServiceAnalytics(serviceUid);
   
   return (
     <div>
       <p>Total Orders: {analytics?.totalOrders}</p>
       <p>Total Revenue: ${analytics?.totalRevenue}</p>
     </div>
   );
   ```

## 6. Critical Rules

- **Tenant Isolation**: Every API call passes `storeId` or uses authenticated context.
- **Error Handling**: Always normalize via `normalizeApiError()`.
- **Toast Notifications**: Use `sonner` for user feedback.
- **Type Safety**: No `any` types. Define types in `types/models/`.
- **Reusability**: Extract common logic into hooks or components.
- **Hook Naming**:
  - `useGet{Resource}()` - Query
  - `useCreate{Resource}()` - Create mutation
  - `useUpdate{Resource}()` - Update mutation
  - `useDelete{Resource}()` - Delete mutation

## 7. Environment & Configuration
- `next.config.ts`: API base URL.
- `.env.local`: Backend API URL, auth secrets.
- `tsconfig.json`: Path aliases (`@/components`, `@/hooks`, `@/types`).
