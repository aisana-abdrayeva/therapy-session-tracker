from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Session(BaseModel):
    patient_name: str
    date: str
    engagement: int
    notes: str

db: List[Session] = []

@app.post("/sessions")
def create_session(session: Session):
    db.append(session)
    return {"message": "Session created"}

@app.get("/sessions", response_model=List[Session])
def get_sessions():
    return db

@app.delete("/sessions/{session_index}")
def delete_session(session_index: int):
    if 0 <= session_index < len(db):
        deleted = db.pop(session_index)
        return {"message": "Session deleted", "deleted": deleted}
    else:
        raise HTTPException(status_code=404, detail="Session not found")
