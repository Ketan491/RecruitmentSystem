"""
MongoDB utility helpers.
Centralises ObjectId ↔ string conversion, datetime serialization,
and safe document access so no route has to repeat boilerplate.
"""
from bson import ObjectId
from datetime import datetime, timezone
from typing import Any


# ── ObjectId helpers ─────────────────────────────────────────────────

def safe_object_id(id_str: str) -> ObjectId | None:
    """Convert string → ObjectId. Returns None on failure (never raises)."""
    try:
        return ObjectId(str(id_str))
    except Exception:
        return None


def str_id(oid) -> str:
    """ObjectId or string → string. Safe to call on already-string ids."""
    return str(oid)


# ── Document serialization ────────────────────────────────────────────

def doc_to_dict(doc: dict | None) -> dict | None:
    """
    Convert a MongoDB document to a JSON-safe dict:
      - ObjectId  → str
      - datetime  → ISO-8601 string (UTC-aware)
      - lists of ObjectId → list of str
    """
    if doc is None:
        return None
    result: dict[str, Any] = {}
    for key, value in doc.items():
        if key == "_id":
            result["id"] = str(value)
        elif isinstance(value, ObjectId):
            result[key] = str(value)
        elif isinstance(value, datetime):
            # Ensure UTC-aware before isoformat
            if value.tzinfo is None:
                value = value.replace(tzinfo=timezone.utc)
            result[key] = value.isoformat()
        elif isinstance(value, list):
            result[key] = [
                str(item) if isinstance(item, ObjectId) else item
                for item in value
            ]
        elif isinstance(value, dict):
            result[key] = doc_to_dict(value)  # nested docs
        else:
            result[key] = value
    return result


def docs_to_list(cursor_docs: list) -> list:
    """Convert a list of MongoDB documents to JSON-safe dicts."""
    return [doc_to_dict(doc) for doc in cursor_docs if doc is not None]


# ── Time helpers ──────────────────────────────────────────────────────

def utcnow() -> datetime:
    """Timezone-aware UTC now. Replaces deprecated datetime.utcnow()."""
    return datetime.now(timezone.utc)
