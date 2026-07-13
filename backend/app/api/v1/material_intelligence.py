from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.services.material_price_service import get_recent_material_prices, serialize_prices
from app.agents.hermes.client import hermes_client
MATERIAL_PRICE_ANALYSIS_PROMPT = """
You are an expert in construction material market analysis.

You will receive:
- A list of historical material prices
- Volatility scores
- Dates
- Regions
- Sources

Your tasks:
1. Analyze price trends and volatility.
2. Predict whether a price increase or decrease is likely.
3. Provide a confidence score (0–1).
4. Generate SQL code to insert an alert into the price_change_alerts table.

SQL format must be EXACTLY:

INSERT INTO price_change_alerts (material, predicted_change, confidence, reason)
VALUES ('<material>', '<increase/decrease>', <confidence>, '<reason>');

Return ONLY valid JSON:

{
  "material": "",
  "predicted_change": "",
  "confidence": 0.0,
  "reason": "",
  "sql": ""
}
"""

router = APIRouter(prefix="/api/v1/ai/materials")

@router.post("/price-intelligence")
def analyze_material_prices(db: Session = Depends(get_db)):
    prices = get_recent_material_prices(db)
    serialized = serialize_prices(prices)

    response = hermes_client.chat(
        prompt=MATERIAL_PRICE_ANALYSIS_PROMPT,
        data={"prices": serialized}
    )

    return response
