<!-- .github/copilot-instructions.md -->
# Copilot / AI Agent Instructions — mvee-clothing-frontend

Purpose
- Help AI coding agents become productive quickly working on this Next.js + TypeScript + Tailwind frontend.

Big picture
- Next.js App Router project using the `app/` directory (see `app/layout.tsx` and `app/page.tsx`).
- Client-side state + caching is handled with `@tanstack/react-query` via `src/providers/ReactQueryProvider.tsx`.
- Data-loading in UI components calls local service objects in `src/services/*` (these are currently mock implementations, e.g. `src/services/product.service.ts`).

Key files & patterns (use these as anchors)
- App root and routes: `src/app/` — nested folders map to routes (admin routes under `src/app/admin/`).
- Providers: `src/providers/ReactQueryProvider.tsx` — wrap children with React Query's `QueryClientProvider`.
- Services: `src/services/*.service.ts` — encapsulate data access; `product.service` currently returns mock data. Replace with `lib/api.ts` calls when wiring a real backend.
- UI primitives: `src/components/ui/` — small, reusable components (e.g. `Button.tsx` supports `variant: 'default'|'outline'`).
- Store UI: `src/components/store/*` — higher-level site components (Header, Footer, ProductCard).
- Contexts: `src/context/*` (e.g. `AuthContext.tsx`, `CartContext.tsx`) — project-level state patterns.

Data & UX specifics to preserve
- Cart persistence uses localStorage key `mvee_cart` in `src/app/page.tsx` (load on mount, save on change).
- `useQuery` usage pattern: query keys are arrays (`['products']`) and `queryFn` points to a service method (e.g. `productService.getAll`). Keep keys stable and descriptive.

Next.js / React conventions to follow
- Routes use the app router. Default export must be a React component (client or server component as intended). If you see "The default export is not a React Component in page: \"/\"", verify the page file exports a React component (e.g. `export default function HomePage(){...}`) and that `use client` is present for client components.
- Use `use client` at top of files that use hooks or browser APIs.

Build & dev commands
- Start dev server: `npm run dev` (runs `next dev`).
- Production build: `npm run build` then `npm run start`.
- Lint: `npm run lint` (uses `next lint`).

Common change patterns and examples
- Replace mock services with real API calls by implementing `src/lib/api.ts` and updating `src/services/*` to call it.
  - Example: `const { data } = useQuery({ queryKey: ['products'], queryFn: productService.getAll })` → `productService.getAll` should call `api.get('/products')` once wired.
- UI: prefer `src/components/ui/*` primitives for consistent styling (e.g. use `Button` instead of raw `button` markup). Example usage: `<Button variant="outline" className="...">`.

Integration points & TODOs for agents
- `src/lib/api.ts` is currently a placeholder — add API client (fetch/axios) and centralize base URL handling.
- `src/context/AuthContext.tsx` and `src/components/admin/AdminGuard.tsx` are present but minimal/empty — implement auth checks and admin route protection here.
- Keep React Query provider in `app/layout.tsx` (or wrap via `providers.tsx`) to ensure queries work across the app.

Pitfalls to avoid
- Do not convert server components to client without `use client` — search for hook usage before adding `use client`.
- When changing route filenames, keep `app/` nested structure consistent (e.g. dynamic routes use `[id]` folders already present).

If you modify behavior that affects global state or rendering (Auth, Cart, QueryClient), run the app locally with `npm run dev` and verify core flows: home, shop, cart persistence, admin login.

Questions for maintainers (ask before large changes)
- Do we have a backend API URL to wire into `src/lib/api.ts` or should agents keep using the mock services?
- Any preferred React Query caching policies or mutation patterns?

If something here is unclear or you want more examples from specific files, tell me which area to expand (services, admin, UI primitives, or app routes).
