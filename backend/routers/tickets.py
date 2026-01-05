from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict
from models.database import get_db
from models.ticket import Ticket
from models.ticket_comment import TicketComment
from schemas.ticket import TicketCreate, TicketUpdate, TicketResponse, TicketAssign, TicketStatusUpdate
from schemas.ticket_comment import TicketCommentCreate, TicketCommentResponse

router = APIRouter()

@router.get("/tickets", response_model=List[TicketResponse])
def list_tickets(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()
    result = []
    for ticket in tickets:
        ticket_dict = {
            "id": ticket.id,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "employee_id": ticket.employee_id,
            "engineer_id": ticket.engineer_id,
            "created_at": ticket.created_at,
            "updated_at": ticket.updated_at,
            "employee": {"name": ticket.employee.name} if ticket.employee else None,
            "engineer": {"name": ticket.engineer.name} if ticket.engineer else None,
        }
        result.append(ticket_dict)
    return result

@router.get("/tickets/kanban", response_model=Dict)
def get_kanban_board(db: Session = Depends(get_db)):
    tickets = db.query(Ticket).all()
    
    kanban_data = {
        "open": [],
        "in_progress": [],
        "resolved": [],
        "closed": []
    }
    
    for ticket in tickets:
        ticket_dict = {
            "id": ticket.id,
            "title": ticket.title,
            "description": ticket.description,
            "status": ticket.status,
            "priority": ticket.priority,
            "employee_id": ticket.employee_id,
            "engineer_id": ticket.engineer_id,
            "created_at": ticket.created_at.isoformat() if ticket.created_at else None,
            "updated_at": ticket.updated_at.isoformat() if ticket.updated_at else None,
            "employee": {"name": ticket.employee.name} if ticket.employee else None,
            "engineer": {"name": ticket.engineer.name} if ticket.engineer else None,
        }
        
        status = ticket.status
        if status in kanban_data:
            kanban_data[status].append(ticket_dict)
    
    return kanban_data

@router.post("/tickets", response_model=TicketResponse)
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db)):
    db_ticket = Ticket(**ticket.dict())
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    
    return {
        "id": db_ticket.id,
        "title": db_ticket.title,
        "description": db_ticket.description,
        "status": db_ticket.status,
        "priority": db_ticket.priority,
        "employee_id": db_ticket.employee_id,
        "engineer_id": db_ticket.engineer_id,
        "created_at": db_ticket.created_at,
        "updated_at": db_ticket.updated_at,
        "employee": {"name": db_ticket.employee.name} if db_ticket.employee else None,
        "engineer": {"name": db_ticket.engineer.name} if db_ticket.engineer else None,
    }

@router.get("/tickets/{id}", response_model=TicketResponse)
def get_ticket(id: int, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return {
        "id": ticket.id,
        "title": ticket.title,
        "description": ticket.description,
        "status": ticket.status,
        "priority": ticket.priority,
        "employee_id": ticket.employee_id,
        "engineer_id": ticket.engineer_id,
        "created_at": ticket.created_at,
        "updated_at": ticket.updated_at,
        "employee": {"name": ticket.employee.name} if ticket.employee else None,
        "engineer": {"name": ticket.engineer.name} if ticket.engineer else None,
    }

@router.put("/tickets/{id}", response_model=TicketResponse)
def update_ticket(id: int, ticket: TicketUpdate, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    for key, value in ticket.dict(exclude_unset=True).items():
        setattr(db_ticket, key, value)
    
    db.commit()
    db.refresh(db_ticket)
    
    return {
        "id": db_ticket.id,
        "title": db_ticket.title,
        "description": db_ticket.description,
        "status": db_ticket.status,
        "priority": db_ticket.priority,
        "employee_id": db_ticket.employee_id,
        "engineer_id": db_ticket.engineer_id,
        "created_at": db_ticket.created_at,
        "updated_at": db_ticket.updated_at,
        "employee": {"name": db_ticket.employee.name} if db_ticket.employee else None,
        "engineer": {"name": db_ticket.engineer.name} if db_ticket.engineer else None,
    }

@router.delete("/tickets/{id}")
def delete_ticket(id: int, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db.delete(db_ticket)
    db.commit()
    return {"message": "Ticket deleted successfully"}

@router.post("/tickets/{id}/assign", response_model=TicketResponse)
def assign_ticket(id: int, assignment: TicketAssign, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db_ticket.engineer_id = assignment.engineer_id
    db.commit()
    db.refresh(db_ticket)
    
    return {
        "id": db_ticket.id,
        "title": db_ticket.title,
        "description": db_ticket.description,
        "status": db_ticket.status,
        "priority": db_ticket.priority,
        "employee_id": db_ticket.employee_id,
        "engineer_id": db_ticket.engineer_id,
        "created_at": db_ticket.created_at,
        "updated_at": db_ticket.updated_at,
        "employee": {"name": db_ticket.employee.name} if db_ticket.employee else None,
        "engineer": {"name": db_ticket.engineer.name} if db_ticket.engineer else None,
    }

@router.patch("/tickets/{id}/status", response_model=TicketResponse)
def update_ticket_status(id: int, status_update: TicketStatusUpdate, db: Session = Depends(get_db)):
    db_ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db_ticket.status = status_update.status
    db.commit()
    db.refresh(db_ticket)
    
    return {
        "id": db_ticket.id,
        "title": db_ticket.title,
        "description": db_ticket.description,
        "status": db_ticket.status,
        "priority": db_ticket.priority,
        "employee_id": db_ticket.employee_id,
        "engineer_id": db_ticket.engineer_id,
        "created_at": db_ticket.created_at,
        "updated_at": db_ticket.updated_at,
        "employee": {"name": db_ticket.employee.name} if db_ticket.employee else None,
        "engineer": {"name": db_ticket.engineer.name} if db_ticket.engineer else None,
    }

@router.get("/tickets/{id}/comments", response_model=List[TicketCommentResponse])
def get_ticket_comments(id: int, db: Session = Depends(get_db)):
    comments = db.query(TicketComment).filter(TicketComment.ticket_id == id).all()
    return comments

@router.post("/tickets/{id}/comments", response_model=TicketCommentResponse)
def create_ticket_comment(id: int, comment: TicketCommentCreate, db: Session = Depends(get_db)):
    ticket = db.query(Ticket).filter(Ticket.id == id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    db_comment = TicketComment(
        ticket_id=id,
        engineer_id=comment.engineer_id,
        comment=comment.comment
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment