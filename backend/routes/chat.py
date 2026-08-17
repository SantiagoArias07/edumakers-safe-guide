import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import get_db, Conversation
from services.claude_service import send_message
from services.auth_service import get_current_user_id, get_optional_user_id
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])


class MessageRequest(BaseModel):
    message: str
    history: list = []


class SaveSessionRequest(BaseModel):
    title: str | None = None
    messages: list


class ConversationResponse(BaseModel):
    id: int
    title: str | None
    messages: list
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


@router.post("/message")
def chat_message(data: MessageRequest):
    if not data.message.strip():
        raise HTTPException(status_code=400, detail="El mensaje no puede estar vacío")

    try:
        result = send_message(data.message, data.history)
    except RuntimeError as e:
        # AI provider failed (misconfigured key, provider down, etc). Return a
        # proper HTTPException so the response carries CORS headers and the
        # frontend can show the real cause instead of a generic network error.
        raise HTTPException(status_code=502, detail=str(e))
    return result


@router.get("/sessions")
def get_sessions(user_id: int = Depends(get_current_user_id), db: Session = Depends(get_db)):
    conversations = (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )

    result = []
    for c in conversations:
        result.append({
            "id": c.id,
            "title": c.title,
            "messages": json.loads(c.messages),
            "created_at": c.created_at.isoformat(),
            "updated_at": c.updated_at.isoformat(),
        })
    return result


@router.post("/sessions")
def save_session(
    data: SaveSessionRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    title = data.title
    if not title and data.messages:
        first_user_msg = next((m for m in data.messages if m.get("role") == "user"), None)
        if first_user_msg:
            title = first_user_msg["content"][:50] + ("..." if len(first_user_msg["content"]) > 50 else "")

    conversation = Conversation(
        user_id=user_id,
        title=title or "Conversación sin título",
        messages=json.dumps(data.messages, ensure_ascii=False),
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "title": conversation.title,
        "messages": json.loads(conversation.messages),
        "created_at": conversation.created_at.isoformat(),
        "updated_at": conversation.updated_at.isoformat(),
    }


@router.put("/sessions/{session_id}")
def update_session(
    session_id: int,
    data: SaveSessionRequest,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == session_id, Conversation.user_id == user_id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    conversation.messages = json.dumps(data.messages, ensure_ascii=False)
    if data.title:
        conversation.title = data.title
    conversation.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(conversation)

    return {
        "id": conversation.id,
        "title": conversation.title,
        "messages": json.loads(conversation.messages),
        "created_at": conversation.created_at.isoformat(),
        "updated_at": conversation.updated_at.isoformat(),
    }


@router.delete("/sessions/{session_id}")
def delete_session(
    session_id: int,
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    conversation = (
        db.query(Conversation)
        .filter(Conversation.id == session_id, Conversation.user_id == user_id)
        .first()
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Sesión no encontrada")

    db.delete(conversation)
    db.commit()
    return {"ok": True}


@router.delete("/sessions")
def delete_all_sessions(
    user_id: int = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    db.query(Conversation).filter(Conversation.user_id == user_id).delete()
    db.commit()
    return {"ok": True}
