from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from models.database import get_db
from models.engineer import Engineer
from schemas.engineer import EngineerCreate, EngineerUpdate, EngineerResponse

router = APIRouter()

@router.get("/engineers", response_model=List[EngineerResponse])
def list_engineers(db: Session = Depends(get_db)):
    engineers = db.query(Engineer).all()
    return engineers

@router.post("/engineers", response_model=EngineerResponse)
def create_engineer(engineer: EngineerCreate, db: Session = Depends(get_db)):
    existing = db.query(Engineer).filter(Engineer.email == engineer.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    db_engineer = Engineer(**engineer.dict())
    db.add(db_engineer)
    db.commit()
    db.refresh(db_engineer)
    return db_engineer

@router.get("/engineers/{id}", response_model=EngineerResponse)
def get_engineer(id: int, db: Session = Depends(get_db)):
    engineer = db.query(Engineer).filter(Engineer.id == id).first()
    if not engineer:
        raise HTTPException(status_code=404, detail="Engineer not found")
    return engineer

@router.put("/engineers/{id}", response_model=EngineerResponse)
def update_engineer(id: int, engineer: EngineerUpdate, db: Session = Depends(get_db)):
    db_engineer = db.query(Engineer).filter(Engineer.id == id).first()
    if not db_engineer:
        raise HTTPException(status_code=404, detail="Engineer not found")
    
    for key, value in engineer.dict(exclude_unset=True).items():
        setattr(db_engineer, key, value)
    
    db.commit()
    db.refresh(db_engineer)
    return db_engineer

@router.delete("/engineers/{id}")
def delete_engineer(id: int, db: Session = Depends(get_db)):
    db_engineer = db.query(Engineer).filter(Engineer.id == id).first()
    if not db_engineer:
        raise HTTPException(status_code=404, detail="Engineer not found")
    
    db.delete(db_engineer)
    db.commit()
    return {"message": "Engineer deleted successfully"}