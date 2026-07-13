from typing import List
from sqlalchemy.orm import Session
from ollama import chat

from app.services.memory_service import add_memory_entry, search_memory


def project_intelligence(db: Session, project_id: int) -> dict:
    """
    High-level intelligence summary for a single project.
    Uses the enterprise memory layer (summaries + risks) as context.
    """

    # 1. Fetch past summaries and risks from memory
    past_summaries = search_memory(db, project_id, entry_type="summary")
    past_risks = search_memory(db, project_id, entry_type="risk")

    # 2. Prepare text context for Hermes
    def format_entries(entries: List) -> str:
        lines = []
        for e in entries:
            source = f"{e.source_type} #{e.source_id}" if e.source_type and e.source_id else "unknown source"
            content = e.content or "(no content)"
            lines.append(f"- [{e.entry_type}] {content} (source: {source}, at {e.created_at})")
        return "\n".join(lines) if lines else "None."

    summaries_text = format_entries(past_summaries)
    risks_text = format_entries(past_risks)

    prompt = f"""
You are an AI assistant providing a high-level intelligence overview for a construction project.

PROJECT ID: {project_id}

PAST SUMMARIES FROM MEMORY:
{summaries_text}

PAST RISKS FROM MEMORY:
{risks_text}

TASK:
1. Synthesize the overall status of the project.
2. Highlight recurring risks or themes.
3. Identify potential blind spots or missing information.
4. Provide clear, actionable recommendations for the next steps.

Be concise, structured, and professional.
"""

    # 3. Call Hermes via Ollama
    response = chat(
        model="hermes3",
        messages=[{"role": "user", "content": prompt}],
    )

    intelligence_summary = response["message"]["content"]

    # 4. Store intelligence summary in enterprise memory
    add_memory_entry(
        db=db,
        project_id=project_id,
        entry_type="intelligence",
        content=intelligence_summary,
        source_id=project_id,
        source_type="project",
        meta={"module": "project_intelligence"}
    )

    return {"project_id": project_id, "intelligence_summary": intelligence_summary}
