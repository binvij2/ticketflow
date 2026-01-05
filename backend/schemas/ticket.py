from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class TicketBase(BaseModel):
    title: str
    description: str
    status: str = "open"
    priority: str = "medium"
    employee_id: int
    engineer_id: Optional[int] = None

class TicketCreate(TicketBase):
    pass

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    engineer_id: Optional[int] = None

class TicketResponse(TicketBase):
    id: int
    created_at: datetime
    updated_at: datetime
    employee: Optional[dict] = None
    engineer: Optional[dict] = None

    class Config:
        from_attributes = True

class TicketAssign(BaseModel):
    engineer_id: int

class TicketStatusUpdate(BaseModel):
    status: str