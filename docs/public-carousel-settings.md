# Public projects carousel settings

The home page (`/`) cycles through filtered projects with:

- **Manual controls** — previous / next buttons
- **Auto-advance** — moves to the next project on a timer (default **5 seconds**)

## Superadmin configuration

Path: **Superadmin → Public display** (`/superadmin/public-display`)

Set **Auto-advance interval (seconds)** (clamped **3–120**). Stored in Mongo `app_settings` under key `public_carousel_interval_seconds`.

## APIs

| Method | Path | Auth |
| --- | --- | --- |
| `GET` | `/api/public/settings/carousel` | Public |
| `GET` | `/api/superadmin/settings/carousel` | Superadmin |
| `PUT` | `/api/superadmin/settings/carousel` | Superadmin + CSRF |

Public response:

```json
{ "success": true, "carousel": { "intervalSeconds": 5 } }
```

## Tests

```bash
npm run test:unit
```

| Area | Path |
| --- | --- |
| Interval normalize | `server/utils/settings/__tests__/normalizeCarouselIntervalSeconds.test.ts` |
