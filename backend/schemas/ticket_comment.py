from pydantic import BaseModel
from datetime import datetime

class TicketCommentBase(BaseModel):
    comment: str
    engineer_id: int

class TicketCommentCreate(TicketCommentBase):
    pass

class TicketCommentResponse(TicketCommentBase):
    id: int
    ticket_id: int
    created_at: datetime

    class Config:
        from_attributes = True