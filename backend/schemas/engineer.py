from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EngineerBase(BaseModel):
    name: str
    email: EmailStr
    specialization: Optional[str] = None
    is_active: bool = True

class EngineerCreate(EngineerBase):
    pass

class EngineerUpdate(EngineerBase):
    pass

class EngineerResponse(EngineerBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True