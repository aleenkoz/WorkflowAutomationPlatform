from app.agents.hermes.client import hermes
from app.agents.hermes.tools.projects_tools import fetch_active_or_on_hold_projects

def summarize_active_projects():
    projects = fetch_active_or_on_hold_projects()

    if not projects:
        return {"summary": "No active or on-hold projects found."}

    prompt = (
        "Summarize the following construction projects. "
        "Focus on status, risks, delays, and recommendations.\n\n"
        f"{projects}"
    )

    summary = hermes.run(prompt)

    return {
        "projects": projects,
        "summary": summary
    }
