from sqlalchemy.orm import Session
from ollama import chat

from app.agents.hermes.tools.projects_tools import fetch_active_or_on_hold_projects
from app.services.memory_service import add_memory_entry


def summarize_active_projects(db: Session):
    """
    Summarize all active or on-hold projects using Hermes.
    Stores the summary in the enterprise memory layer.
    """

    projects = fetch_active_or_on_hold_projects(db)

    if not projects:
        return {"summary": "No active or on-hold projects found."}

    # Build a text list of projects
    project_lines = []
    for p in projects:
        project_lines.append(
            f"- Project #{p.id}: {p.name} | Status: {p.status} | Start: {p.start_date} | End: {p.end_date}"
        )

    project_text = "\n".join(project_lines)

    prompt = f"""
You are an AI assistant summarizing all active or on-hold construction projects.

PROJECT LIST:
{project_text}

TASK:
1. Provide a clear summary of the overall project portfolio.
2. Highlight any risks, delays, or coordination issues visible from the project statuses.
3. Suggest next steps or actions for management.
4. Keep the summary concise and professional.
"""

    response = chat(
        model="hermes3",
        messages=[{"role": "user", "content": prompt}]
    )

    summary = response["message"]["content"]

    # Store in enterprise memory
    add_memory_entry(
        db=db,
        project_id=0,  # system-level summary
        entry_type="summary",
        content=summary,
        source_id=None,
        source_type="system",
        meta={"module": "summarize_active_projects"}
    )

    return {"summary": summary}
