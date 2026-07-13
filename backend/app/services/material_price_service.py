from sqlalchemy.orm import Session
from sqlalchemy import text

from app.models.material_prices import MaterialPrice

def get_recent_material_prices(db: Session, limit: int = 50):
    return (
        db.query(MaterialPrice)
        .order_by(MaterialPrice.date.desc())
        .limit(limit)
        .all()
    )

def serialize_prices(prices):
    return [
        {
            "material_name": p.material_name,
            "price": float(p.price),
            "date": p.date.isoformat(),
            "region": p.region,
            "source": p.source,
            "volatility_score": float(p.volatility_score)
        }
        for p in prices
    ]

def execute_alert_sql(db, sql: str):
    try:
        db.execute(text(sql))
        db.commit()
        return True
    except Exception as e:
        print("SQL ERROR:", e)
        db.rollback()
        return False
