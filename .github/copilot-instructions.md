# Copilot Instructions - Social Media Store Frontend

You are working in `social-media-store-frontend`, a Next.js 15 application for SMM service marketplace.

## 🛠 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19 + Tailwind CSS + shadcn/ui
- **State Management**: React Query (server state) + Context API (global state)
- **Networking**: Axios
- **Notifications**: Sonner (toasts)

## 🏗 Architecture
Same layered pattern as shop-frontend:

1. **Pages** (`app/admin/*`, `app/client/*`): Route handlers, compose hooks + components.
2. **Hooks** (`hooks/use-*.tsx`): React Query wrappers for API calls.
3. **Components** (`components/`): Reusable, presentational React components.
4. **Context** (`context/appContext.tsx`): Global app state (store, user, auth, API client).
5. **Types** (`types/`): TypeScript definitions (aligned with backend schemas).

## 🚨 Critical Rules

### 0. UI Consistency Pre-Check (Mandatory)
- Before creating new UI, review this frontend's current visual direction on its home and pricing pages.
- Check existing components before creating new controls:
  - `components/ui/`
  - `components/`
- Prefer extending existing components instead of creating duplicates.
- Do not use raw/native control implementations when an existing project component already exists for the same behavior.

### 1. Always Use Hooks, Never Direct API Calls
```typescript
// ✅ CORRECT
const { data: services } = useGetServicesByPublic();

// ❌ WRONG
const services = await api.get(`/services`);
```

### 2. Tenant Isolation via storeId
Every hook must include `storeId` in:
- Query keys: `["services", storeId]`
- Enabled conditions: `enabled: !!storeId`
- API calls: append to URL if required

### 3. Error Handling Pattern
```typescript
import { normalizeApiError } from "@/utils/normalizeApiErrors";

onError: (error: unknown) => {
  const message = normalizeApiError(error, "Default message");
  toast.error(message);
},
```

### 4. Cache Invalidation on Mutation
```typescript
onSuccess: () => {
  toast.success("Order placed successfully");
  queryClient.invalidateQueries({ queryKey: ["orders", storeId] });
},
```

### 5. Type Safety
- Import types from `@/types`.
- Never use `any`.
- Define new types in `@/types/models/`.

### 6. Component Patterns
**Hooks in Page Components, Not UI Components**:
```typescript
// ✅ Page component using hooks
export default function AdminServicesPage() {
  const { data: services } = useGetServicesByAdmin();
  return <ServiceList services={data} />;
}

// ✅ UI component receiving props
export function ServiceList({ services }: { services: Service[] }) {
  return <div>{services.map(...)}</div>;
}

// ❌ UI component using hooks
export function ServiceList() {
  const { data } = useGetServicesByAdmin(); // Wrong layer!
  return <div>{data.map(...)}</div>;
}
```

## 📋 Feature Implementation Checklist

Adding a new SMM feature (e.g., "Service Performance Analytics"):

1. [ ] **Backend Ready**: Verify endpoint exists. `GET /v1/services/:uid/analytics`.
2. [ ] **Define Type**: Create `types/models/analytics.ts`.
3. [ ] **Create Hook**: Create `hooks/use-analytics.tsx`.
   - Implement `useGetServiceAnalytics()`
4. [ ] **Create Components** (if needed):
   - `components/AnalyticsDashboard.tsx`
5. [ ] **Add to Page**:
   - Import hook
   - Import component
   - Bind callbacks
6. [ ] **Test**: Verify end-to-end flow works.

## 🎨 Styling & UI
- **Framework**: Tailwind CSS.
- **Components**: Use `components/ui/` (shadcn) for primitives.
- **Custom**: Compose custom components in `components/`.
- **Responsiveness**: Mobile-first approach.

## 🔐 Authentication
Same pattern as shop-frontend:

**Admin Pages**:
```typescript
import withAuth from "@/lib/withAuth";
export default withAuth({
  WrappedComponent: AdminPage,
  userType: "admin",
  excludePaths: ["/signin"],
})(AdminPageComponent);
```

**User Pages**:
```typescript
export default withAuth({
  WrappedComponent: UserPage,
  userType: "user",
})(UserPageComponent);
```

## 📁 File Naming
| Type | Pattern |
|---|---|
| Pages | `page.tsx` (lowercase) |
| Components | `ComponentName.tsx` (PascalCase) |
| Hooks | `use-feature.tsx` (kebab-case) |
| Types | `filename.ts` (kebab-case, in `types/models/`) |
| Utilities | `utility-name.ts` (kebab-case) |

## 🚫 Anti-Patterns
- **Do NOT** call `api` directly from components (use hooks).
- **Do NOT** hardcode `storeId` (get from context).
- **Do NOT** use untyped data (use `@/types`).
- **Do NOT** show errors without normalization.
- **Do NOT** forget cache invalidation after mutations.

## 🔗 Key Files to Review
- `context/appContext.tsx`: Global state, API client setup.
- `hooks/use-order.tsx`: Example hook pattern.
- `hooks/use-services.tsx`: SMM-specific hook example.
- `app/admin/services/page.tsx`: Example admin page.
- `app/client/services/page.tsx`: Example public page.
- `lib/withAuth.tsx`: Auth HOC pattern.
- `utils/normalizeApiErrors.ts`: Error handling.
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