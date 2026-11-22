from datetime import datetime, timezone

_counters = {}  # TEMPORARY in memory. Will move to the database later.


def generate_case_id() -> str:
    year = datetime.now(timezone.utc).year
    _counters[year] = _counters.get(year, 0) + 1
    return f"BW-{year}-{_counters[year]:05d}"
