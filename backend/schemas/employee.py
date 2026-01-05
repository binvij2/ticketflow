from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class EmployeeBase(BaseModel):
    name: str
    email: EmailStr
    department: Optional[str] = None

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeUpdate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True