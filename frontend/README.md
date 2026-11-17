# BuildWatch Frontend

React frontend for **BuildWatch: AI-Based Construction Debris and Public-Space Obstruction Monitoring System** (academic mini-project, educational prototype).

The frontend talks **only** to the FastAPI backend. It never connects to PostgreSQL, and it never calculates severity. It displays values returned by the backend.

## Tech

React (Vite), React Router, Leaflet + OpenStreetMap, plain CSS.

## Run locally

```
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open http://localhost:5173

## Configuration (`frontend/.env`)

| Variable            | Meaning                                                     |
| ------------------- | ----------------------------------------------------------- |
| `VITE_API_BASE_URL` | FastAPI address, e.g. `http://localhost:8000`               |
| `VITE_USE_MOCK`     | `true` = sample data in the browser, `false` = real backend |

Restart `npm run dev` after changing `.env`.

**Demo mode:** with `VITE_USE_MOCK=true`, data lives only in browser memory and resets on page refresh. A yellow banner is shown. To use the real backend, set `VITE_USE_MOCK=false`.

## Folder structure

```
src/
  config.js          API base URL, mock switch, default map centre (only place for these)
  constants.js       roles, debris categories, area types, statuses, severity labels
  services/api.js    every backend call (the only file that uses fetch)
  mocks/             sample data for demo mode (single central location)
  components/        LocationPicker, Badge, BeforeAfter, FollowUpUpload, DemoBanner
  pages/             Home, ReportForm, CaseList, CaseDetails, AdminDashboard, Hotspots
```

## Pages

| Route            | Page                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| `/`              | Home with overview counts                                               |
| `/report`        | Report submission (photo, description, area type, map location)         |
| `/cases`         | Case list with status filter                                            |
| `/cases/:caseId` | Case details, before/after comparison, follow-up upload, status history |
| `/hotspots`      | Hotspot map coloured by severity                                        |
| `/admin`         | Admin dashboard (priority list, status changes, verify)                 |

## API calls used

| Function             | Endpoint                            | Notes                                                                                                       |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `getReports`         | `GET /reports`                      |                                                                                                             |
| `getReport`          | `GET /reports/{case_id}`            | assumed to include `follow_ups`                                                                             |
| `createReport`       | `POST /reports`                     | `multipart/form-data`: `image`, `description`, `latitude`, `longitude`, `public_area_type`, `reporter_role` |
| `getReportHistory`   | `GET /reports/{case_id}/history`    | assumed array of `{ status, changed_at, note }`                                                             |
| `updateReportStatus` | `PUT /reports/{case_id}/status`     | JSON `{ status, note }`                                                                                     |
| `verifyReport`       | `POST /reports/{case_id}/verify`    | JSON `{ verified, note }`                                                                                   |
| `getHotspots`        | `GET /dashboard/hotspots`           | assumed array of `{ latitude, longitude, case_count, max_severity }`                                        |
| `submitFollowUp`     | `POST /reports/{case_id}/follow-up` | `multipart/form-data`: `image`, `note`                                                                      |

## Open decisions for the team ([DECISION REQUIRED])

1. JSON format of history, hotspots and follow-ups (assumed above).
2. Format of `detected_debris` (assumed: array of category strings) and `image` (assumed: full URL).
3. `POST /reports` as `multipart/form-data` (assumed).
4. Authentication and roles: there is no login, so `/admin` is open in this prototype.
5. Assigning a case to a specific person (currently only a status change to `ASSIGNED`).
6. Backend must enable CORS for `http://localhost:5173`.

## Notes

- Shared names (roles, categories, statuses, severity 1 to 4) are defined once in `src/constants.js`.
- The AI before/after result is shown as a suggestion only. The administrator verifies the final result.
