from pydantic import BaseModel
from datetime import date

class MeetingBase(BaseModel):
    project_id: int
    meeting_date: date
    title: str
    meeting_type: str

class MeetingCreate(MeetingBase):
    pass

class MeetingRead(MeetingBase):
    id: int

    class Config:
        orm_mode = True
