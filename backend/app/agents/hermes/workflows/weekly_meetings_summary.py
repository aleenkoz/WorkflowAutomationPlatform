from ollama import chat
from sqlalchemy.orm import Session

from app.services.meetings_service import (
    get_meetings_for_project,
    analyze_meeting_types
)
from app.services.memory_service import add_memory_entry

""" Functions for Hermes to generate weekly meeting summaries for construction projects.
Hermes analyzes the meetings held in the past week, identifies which expected meeting types
were completed or are still missing, and generates a concise summary with recommendations for next steps. 
The summary is stored in the enterprise memory layer for future reference. """

def weekly_meeting_summary(db: Session, project_id: int):
    """
    Generate a weekly meeting summary for a project using Hermes.
    Stores the summary in the enterprise memory layer.
    """

    meetings = get_meetings_for_project(db, project_id)
    analysis = analyze_meeting_types(meetings)

    meetings_text = "".join(
        f"- {m.meeting_date} — {m.title} ({m.meeting_type})\n"
        for m in meetings
    )

    completed_text = "".join(f"- {t}\n" for t in analysis["completed"])
    missing_text = "".join(f"- {t}\n" for t in analysis["missing"])

    prompt = f"""
You are an AI assistant generating a weekly meeting summary for a construction project.

PROJECT ID: {project_id}

MEETINGS HELD:
{meetings_text}

MEETING TYPES COMPLETED:
{completed_text}

MEETING TYPES STILL MISSING:
{missing_text}

TASK:
Write a clear, concise weekly summary describing:
1. What meeting types out of the expected ones were held.
2. Which meeting types are still pending.
3. Recommendations for next week.
"""

    response = chat(
        model="hermes3",
        messages=[{"role": "user", "content": prompt}]
    )

    summary = response["message"]["content"]

    # Store in enterprise memory
    add_memory_entry(
        db=db,
        project_id=project_id,
        entry_type="summary",
        content=summary,
        source_type="meeting",
        meta={
            "module": "weekly_meeting_summary",
            "meeting_count": len(meetings),
            "completed_types": analysis["completed"],
            "missing_types": analysis["missing"],
        }
    )

    return {"summary": summary}
