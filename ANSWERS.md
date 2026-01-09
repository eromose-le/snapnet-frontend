# Answers (keep concise)

## Q1 — Frontend structure (5–10 mins)
How would you structure a large React SaaS frontend (features/shared/api/permissions)?
- `features/` per domain (employees, billing) with pages + local components/hooks
- `shared/` for design system, primitives, and generic hooks/utils
- `api/` for typed clients + query key factories + DTO mappers
- `permissions/` for policy definitions + helper hooks (`useCan`, flags)

## Q2 — Multi-tenant handling (5–10 mins)
How would you isolate cached data per tenant and prevent cross-tenant leaks?
- Include `tenantId` in every query key and API path/headers
- Clear/invalidate queries on tenant switch; avoid global singletons with tenant state
- Scope caches per tenant when possible (separate clients or key prefixes)

## Q3 — Performance (5–10 mins)
What are common causes of slow tables/lists and what fixes would you apply?
- Rendering too many rows: add pagination or virtualization
- Expensive derived work each render: memoize and precompute
- Unstable props/handlers: `useCallback`, `memo`, stable keys
- Large DOM updates on filter: defer input, debounce, and keep previous data

## Q4 — Debugging & judgment (10–15 mins)
For each issue, identify likely cause + fix:
1) API calls firing multiple times unnecessarily
   - Cause: changing query key, re-created params/handlers, strict mode double-invoke
   - Fix: stabilize inputs, use proper query keys, guard with `enabled`
2) UI freezing when filters are applied
   - Cause: heavy filter logic on main thread + full re-render
   - Fix: move filtering server-side, debounce, virtualization, `useDeferredValue`
3) stale data after company switch
   - Cause: tenantId not in cache key or cache not invalidated
   - Fix: include tenantId in key and invalidate/remove queries on switch
