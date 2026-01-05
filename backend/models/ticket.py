from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from models.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    status = Column(String(50), nullable=False, default="open", index=True)
    priority = Column(String(50), nullable=False, default="medium")
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    engineer_id = Column(Integer, ForeignKey("engineers.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    employee = relationship("Employee", foreign_keys=[employee_id])
    engineer = relationship("Engineer", foreign_keys=[engineer_id])