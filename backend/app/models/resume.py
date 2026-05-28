"""Resume-related Pydantic models."""
from pydantic import BaseModel
from typing import Any
from datetime import datetime

class ResumeData(BaseModel):
    """Structured data extracted from a resume PDF."""
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    summary: str | None = None
    skills: list[str] = []
    education: list[dict[str, Any]] = []
    experience: list[dict[str, Any]] = []
    certifications: list[str] = []
    languages: list[str] = []
    keywords: list[str] = []
    raw_text: str | None = None

class ResumeResponse(BaseModel):
    """What gets returned after uploading/analyzing a resume."""
    id: str
    user_id: str
    filename: str
    file_path: str
    extracted_data: ResumeData
    uploaded_at: datetime
    analyzed: bool = False

class ATSRequest(BaseModel):
    """Request body for ATS score calculation."""
    resume_id: str
    job_description: str
    job_title: str | None = None

class ATSResponse(BaseModel):
    """ATS score result with detailed breakdown."""
    resume_id: str
    job_title: str | None = None
    overall_score: float
    matched_skills: list[str]
    missing_skills: list[str]
    matched_keywords: list[str]
    missing_keywords: list[str]
    experience_match: float
    education_match: float
    suggestions: list[str]
    calculated_at: datetime

class RecommendationResponse(BaseModel):
    """AI-generated recommendations based on resume analysis."""
    user_id: str
    recommended_roles: list[dict[str, Any]]
    missing_skills: list[str]
    recommended_courses: list[dict[str, Any]]
    career_path: list[str]
    generated_at: datetime
