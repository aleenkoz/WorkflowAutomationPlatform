from ollama import chat
from sqlalchemy.orm import Session
from app.database.session import SessionLocal

from app.models.generated_documents import GeneratedDocument
from app.schemas.project_risks import ProjectRiskCreate
from app.services.risk_detection_service import create_risk
from app.services.memory_service import add_memory_entry

""" Functions for Hermes to detect risks in construction project communications. 
Hermes analyzes emails and other documents to identify potential risks,
categorizes them, and stores them in the enterprise memory layer for future reference. """

def risk_to_dict(risk):
    return {
        "id": risk.id,
        "project_id": risk.project_id,
        "email_id": risk.email_id,
        "risk_type": risk.risk_type,
        "severity": risk.severity,
        "description": risk.description,
        "detected_at": risk.detected_at.isoformat() if risk.detected_at else None
    }


def analyze_email_for_risks(email_body: str):
    prompt = f"""
    Analyze the following construction project email and extract any risks mentioned.

    For each risk, return lines in this exact format:
    Risk Type: <one of Delay, Safety, Procurement, NCR, Approval, Coordination>
    Severity: <Low, Medium, High>
    Description: <1–2 sentences>

    If no risks are found, return:
    Risk Type: None
    Severity: None
    Description: No risks found.

    Email:
    {email_body}
    """

    response = chat(
        model="hermes3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]


def parse_risk_output(analysis: str):
    lines = [line.strip() for line in analysis.split("\n") if line.strip()]

    risk_type = "Unknown"
    severity = "Unknown"
    description = analysis

    for line in lines:
        if line.lower().startswith("risk type"):
            parts = line.split(":", 1)
            if len(parts) > 1:
                risk_type = parts[1].strip()
        elif line.lower().startswith("severity"):
            parts = line.split(":", 1)
            if len(parts) > 1:
                severity = parts[1].strip()
        elif line.lower().startswith("description"):
            parts = line.split(":", 1)
            if len(parts) > 1:
                description = parts[1].strip()

    return risk_type, severity, description


def run_risk_detection():
    db: Session = SessionLocal()
    emails = db.query(GeneratedDocument).all()
    results = []

    for email in emails:
        analysis = analyze_email_for_risks(email.body)
        risk_type, severity, description = parse_risk_output(analysis)

        risk_entry = ProjectRiskCreate(
            project_id=email.project_id,
            email_id=email.id,
            risk_type=risk_type,
            severity=severity,
            description=description
        )

        # Create risk in DB
        saved = create_risk(db, risk_entry)

        # Safety guard: skip if creation failed
        if not saved:
            continue

        results.append(saved)

        # Store in enterprise memory
        add_memory_entry(
            db=db,
            project_id=saved.project_id,
            entry_type="risk",
            content=saved.description,
            source_id=saved.id,
            source_type="risk",
            meta={
                "severity": saved.severity,
                "email_id": saved.email_id,
                "risk_type": saved.risk_type,
            }
        )

    clean_risks = [risk_to_dict(r) for r in results]

    return {
        "total_emails": len(emails),
        "risks_detected": len(clean_risks),
        "risks": clean_risks
    }
