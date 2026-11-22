-- BuildWatch database schema v1 (PostgreSQL + PostGIS)
-- Owner: Member 2

CREATE EXTENSION IF NOT EXISTS postgis;

-- Counter used by the backend to generate case IDs like BW-2026-00001
CREATE TABLE IF NOT EXISTS case_counters (
    year INTEGER PRIMARY KEY,
    last_number INTEGER NOT NULL DEFAULT 0
);

-- Main table: one row per obstruction case
CREATE TABLE IF NOT EXISTS cases (
    case_id VARCHAR(20) PRIMARY KEY,
    reporter_role VARCHAR(20) NOT NULL
        CHECK (reporter_role IN ('CITIZEN', 'FIELD_WORKER', 'ADMINISTRATOR')),
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location geography(Point, 4326) NOT NULL,
    public_area_type VARCHAR(20) NOT NULL
        CHECK (public_area_type IN ('FOOTPATH', 'ROAD', 'DRAIN')),
    primary_category VARCHAR(20),
    severity INTEGER NOT NULL DEFAULT 1
        CHECK (severity BETWEEN 1 AND 4),
    status VARCHAR(30) NOT NULL DEFAULT 'REPORTED'
        CHECK (status IN ('REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS',
                          'VERIFICATION_PENDING', 'RESOLVED', 'CLOSED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fast "find nearby cases" searches (used for duplicate detection)
CREATE INDEX IF NOT EXISTS idx_cases_location ON cases USING GIST (location);
