# Superadmin RBAC

Dynamic roles and permissions for Kwentas Klaras, managed from a separate Superadmin portal.

## Decisions

- Superadmin credentials come from **env only** (`SUPERADMIN_EMAIL`, `SUPERADMIN_PASSWORD`, `SUPERADMIN_SESSION_SECRET`)
- Superadmin is **not** a Firebase user and **not** in the `users` collection
- Municipal users keep Firebase login; their `User.role` is a **role slug** (`admin`, `staffs`, or custom)
- Permissions are a seeded catalog of `action` + `subject` keys (view/assign in Superadmin; not created from the UI)
- Roles are many-to-many with permissions via `role_permissions`

## Models

| Collection | Purpose |
| --- | --- |
| `roles` | Role definitions (`slug`, `name`, `isSystem`) |
| `permissions` | Permission catalog (`key`, `action`, `subject`, `label`, `isSystem`) |
| `role_permissions` | Links roles to permissions |

System seed (also auto-ensured on Superadmin/API bootstrap):

- Role `admin` → all seeded permissions including `manage:all`
- Role `staffs` → all admin **nav** reads except Users (`read:User`), all project-detail **read** tab permissions, `read:Profile`, `update:Profile`

### Admin sidebar nav permissions

| Nav item | Permission |
| --- | --- |
| Dashboard | `read:Dashboard` |
| Projects | `read:Project` |
| Reports | `read:Report` |
| Graphs | `read:Graph` |
| Check Payment | `read:CheckPayment` |
| Users | `read:User` |
| Settings | `read:Settings` |

FE filters `ADMIN_MENU` via `useAdminNavPermissions`; `auth.global` redirects away from routes the user cannot access.

### Project Details tab permissions

| Tab | View | Actions |
| --- | --- | --- |
| Project Summary | `read:ProjectSummary` | — |
| Timeline | `read:ProjectTimeline` | — |
| Details | `read:ProjectDetails` | — |
| Budget | `read:Budget` | `create:Budget` (Add Additional Budget) |
| Obligations | `read:Obligation` | `create:Obligation` (Add Obligation) |
| Disbursements | `read:Disbursement` | `create:Disbursement` (Add Disbursement) |
| Logs | `read:ProjectLog` | `export:ProjectLog` (Export to Excel) |
| Documents | `read:Document` | `create:Document` (Add Document) |
| Project Map | `read:ProjectMap` | `update:ProjectMap` (Save), `delete:ProjectMap` (Clear Location) |

FE gates tabs/buttons via `useProjectDetailPermissions`. BE enforces create/export/map mutations with `requirePermission`.

Seed CLI:

```bash
npm run seed:roles-permissions
```

## Superadmin auth

1. `POST /api/superadmin/auth/login` — timing-safe compare against env; sets httpOnly `superadmin_session`
2. `GET /api/superadmin/auth/me` — session check
3. `POST /api/superadmin/auth/logout` — clears cookie
4. All `/api/superadmin/**` mutating routes use `requireSuperadmin` + CSRF (CSRF accepts municipal `session_token` or `superadmin_session`)

UI:

- `/superadmin/login`
- `/superadmin` overview
- `/superadmin/roles` + `/superadmin/roles/:id`
- `/superadmin/permissions`
- `/superadmin/barangays`, `/superadmin/services`, `/superadmin/implementing-units` (see `docs/superadmin-catalogs.md`)

Async first paint uses skeleton placeholders under `app/components/skeletons/superadmin/` (no “Loading…” copy).

## Municipal app wiring

- Login / `/api/auth/me` return `user.permissions[]` for the user’s role slug
- FE `createAbility(user)` builds CASL rules from that list
- FE helpers (`useUserPermissions`) use ability checks, not hard-coded admin-only for projects/users
- User create/edit role picker loads `/api/roles` (all role slugs, including custom)
- Create and update user APIs validate `role` against the roles catalog and **persist** the slug on the user
- Mutating user/project APIs use `requirePermission(action, subject)`

## Tests

```bash
npm run test:unit
```

| Area | Path |
| --- | --- |
| Permission catalog | `app/constants/rbac/__tests__/permissionCatalog.test.ts` |
| Admin nav permissions | `app/constants/admin/__tests__/adminNavPermissions.test.ts` |
| Admin nav access helpers | `app/utils/__tests__/adminNavAccess.test.ts` |
| Project detail tab permissions | `app/constants/project/__tests__/detailTabPermissions.test.ts` |
| Permission key validation | `server/utils/__tests__/permissionKey.test.ts` |
| Role slug validation | `server/utils/__tests__/roleSlug.test.ts` |
| Superadmin session crypto | `server/utils/__tests__/superadminSessionCrypto.test.ts` |
| CASL ability builder | `app/abilities/__tests__/createAbility.test.ts` |
| Role department rule | `app/utils/user/__tests__/roleRequiresDepartment.test.ts` |
| Role label formatting | `app/utils/user/__tests__/formatRoleLabel.test.ts` |

Covers permission key validation, role slug validation, admin nav + project-detail permission maps, user role assignment helpers, and ability building from permission grants.
