# Superadmin catalogs (Barangays, Services, Implementing Units)

Dynamic reference lists used by municipal project and user forms.

## Mapping

| Superadmin UI | DB model / collection | Municipal API (read) |
| --- | --- | --- |
| Barangays | `Location` / `locations` | `GET /api/locations` |
| Services | `Service` / `services` | `GET /api/services` |
| Implementing Units | `Department` / `departments` | `GET /api/departments` |

Projects store these as **name strings** (`location`, `services`, `implementingUnit`). Renaming a catalog item does not rewrite existing project rows.

## Superadmin APIs

All require `requireSuperadmin` (+ CSRF on writes):

| Resource | Endpoints |
| --- | --- |
| Barangays | `GET/POST /api/superadmin/locations`, `PUT/DELETE /api/superadmin/locations/:id` |
| Services | `GET/POST /api/superadmin/services`, `PUT/DELETE /api/superadmin/services/:id` |
| Implementing Units | `GET/POST /api/superadmin/departments`, `PUT/DELETE /api/superadmin/departments/:id` |

## UI

- `/superadmin/barangays`
- `/superadmin/services`
- `/superadmin/implementing-units`

Shared manager: `NamedCatalogManager.vue` + `useNamedCatalog` / `useNamedCatalogPage`.

First paint uses `TableListSkeleton` (no “Loading…” text).

## Seed

```bash
npx tsx seeders/seedDepartmentsLocations.ts
```

Seeds default services, departments (implementing units), barangays (locations), and remarks.

## Tests

```bash
npm run test:unit
```

| Area | Path |
| --- | --- |
| Catalog name validation | `app/utils/catalog/__tests__/normalizeCatalogName.test.ts` |
| Catalog resource config | `app/constants/superadmin/__tests__/catalogResources.test.ts` |
