from app.services.material_price_service import (
    get_recent_material_prices,
    serialize_prices,
    execute_alert_sql
)
from ollama import chat
import json

def extract_first_json_block(text: str):
    """
    Extract ONLY the first valid JSON object from Hermes output.
    """
    start = text.find("{")
    end = text.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise ValueError("No valid JSON object found in Hermes output.")

    json_block = text[start:end+1]

    # Try parsing — if it fails, JSON is malformed
    try:
        return json.loads(json_block)
    except json.JSONDecodeError:
        raise ValueError("Hermes returned malformed JSON. Raw output:\n" + text)


MATERIAL_PRICE_ANALYSIS_PROMPT = """
You are an expert in construction material market analysis.

You will receive historical material prices and volatility scores.

Your tasks:
1. Analyze price trends and volatility for each material.
2. Decide whether a price increase, decrease, or no significant change is likely.
3. Provide a confidence score (0–1).
4. Generate SQL alerts to insert into the price_change_alerts table.

You MUST return a SINGLE valid JSON object with this exact structure:

{
  "analysis": [
    {
      "material": "string",
      "trend": "string",
      "volatility": "string",
      "predicted_change": "string",
      "confidence": 0.0,
      "reason": "string"
    }
  ],
  "sql_alerts": [
    {
      "material": "string",
      "predicted_change": "string",
      "confidence": 0.0,
      "reason": "string",
      "sql": "INSERT INTO price_change_alerts (material, predicted_change, confidence, reason) VALUES ('...', '...', 0.0, '...');"
    }
  ]
}

Important:
- All SQL statements MUST be inside the "sql" field as strings.
- Do NOT return raw SQL directly in the array.
- Do NOT include comments, explanations, or any text outside the JSON.
Return ONLY this JSON object.
"""

def run_material_price_intelligence(db):
    prices = get_recent_material_prices(db)
    serialized = serialize_prices(prices)

    response = chat(
        model="hermes3",
        messages=[
            {"role": "user", "content": MATERIAL_PRICE_ANALYSIS_PROMPT},
            {"role": "user", "content": f"Here is the material price data:\n{serialized}"}
        ],
        options={"temperature": 0.7}
    )

    raw_output = response["message"]["content"]
    parsed = json.loads(raw_output)

    # Execute SQL for each alert
    for alert in parsed.get("sql_alerts", []):
        sql = alert.get("sql")
        if sql:
            execute_alert_sql(db, sql)

    parsed["sql_executed"] = True  # or track per-alert if you want

    return parsed


