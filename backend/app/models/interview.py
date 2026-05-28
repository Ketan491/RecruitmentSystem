"""Interview analysis models."""
from pydantic import BaseModel
from datetime import datetime

class InterviewAnalysis(BaseModel):
    """Result from analyzing an interview session."""
    user_id: str
    transcript: str
    filler_words: dict[str, int]  # e.g. {"um": 5, "uh": 3}
    filler_word_count: int
    total_words: int
    filler_ratio: float
    speech_speed_wpm: int  # words per minute
    confidence_score: float  # 0-100
    clarity_score: float
    feedback: list[str]
    strengths: list[str]
    improvements: list[str]
    duration_seconds: int
    analyzed_at: datetime

class InterviewReport(BaseModel):
    """Stored interview report."""
    id: str
    user_id: str
    analysis: InterviewAnalysis
    session_date: datetime
