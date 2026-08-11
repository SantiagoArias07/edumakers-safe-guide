"""
Seed script — creates demo user "Santiago" with sample conversations.

Usage (local SQLite):
    python seed_demo.py

Usage (Neon Postgres):
    DATABASE_URL="postgresql://user:pass@host/db?sslmode=require" python seed_demo.py
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(__file__))

from database import SessionLocal, User, Conversation, create_tables
from services.auth_service import hash_password

DEMO_EMAIL    = "santiago@safeguide.demo"
DEMO_PASSWORD = "SafeGuide2026"
DEMO_NAME     = "Santiago"
DEMO_CITY     = "Monterrey"

CONVERSATIONS = [
    {
        "title": "Orientación sobre violencia familiar",
        "messages": [
            {"role": "user",      "content": "Hola, necesito orientación sobre una situación de violencia en casa.", "id": 1},
            {"role": "assistant", "content": "Hola. Primero que nada, quiero que sepas que estás en un espacio seguro.\n\nLo que describes es serio y mereces apoyo. ¿Puedes contarme un poco más? ¿Estás en un lugar seguro en este momento?", "id": 2},
            {"role": "user",      "content": "Sí, estoy segura por ahora. Es mi pareja — lleva meses controlando todo lo que hago.", "id": 3},
            {"role": "assistant", "content": "Entiendo. El control es una forma reconocida de violencia por la ley. No estás exagerando.\n\n¿En qué ciudad estás? Así puedo orientarte sobre recursos específicos cerca de ti.", "id": 4},
            {"role": "user",      "content": "Estoy en Monterrey.", "id": 5},
            {"role": "assistant", "content": "En Monterrey tienes varias opciones:\n\n1. **Centro de Justicia para las Mujeres Nuevo León** — atención legal y psicológica gratuita\n2. **CAVI** en la Fiscalía General del Estado\n3. **LÍNEA VIDA**: 800 911 2000 (24 horas, gratuita)\n\n¿Te gustaría que te mostrara el mapa con los recursos verificados en Monterrey?", "id": 6},
        ],
    },
    {
        "title": "¿Cómo levanto una denuncia?",
        "messages": [
            {"role": "user",      "content": "¿Cómo puedo levantar una denuncia por violencia?", "id": 1},
            {"role": "assistant", "content": "Antes de darte los pasos, ¿estás en un momento seguro para hablar? ¿La situación está ocurriendo ahora o fue en el pasado?", "id": 2},
            {"role": "user",      "content": "Fue en el pasado. Quiero saber mis opciones.", "id": 3},
            {"role": "assistant", "content": "Perfecto. Puedes presentar una denuncia en:\n\n1. **Fiscalía General del Estado** de tu entidad\n2. **CAVI (Centro de Atención a Víctimas)** — te acompañan durante todo el proceso\n3. **Ministerio Público** más cercano\n\n**Qué necesitas llevar:**\n- Identificación oficial\n- Descripción de los hechos (fechas, lugares)\n- Evidencias si tienes (fotos, mensajes, documentos médicos)\n\nNo necesitas abogado — el Estado está obligado a asignarte uno gratuitamente. ¿Tienes alguna duda sobre el proceso?", "id": 4},
        ],
    },
    {
        "title": "Apoyo psicológico en CDMX",
        "messages": [
            {"role": "user",      "content": "Quiero apoyo psicológico, ¿dónde puedo encontrarlo?", "id": 1},
            {"role": "assistant", "content": "Buscar apoyo es un paso muy importante. En México hay varias opciones según tu situación.\n\n¿En qué ciudad estás?", "id": 2},
            {"role": "user",      "content": "Ciudad de México.", "id": 3},
            {"role": "assistant", "content": "En CDMX tienes opciones gratuitas:\n\n**Instituciones públicas:**\n- **Línea de la Vida**: 800 911 2000 — también orientación psicológica\n- **CAVI** en la Fiscalía General de Justicia CDMX\n- **Centros de Desarrollo Comunitario** de cada alcaldía\n\n¿Prefieres atención presencial o a distancia? ¿Quieres ver las opciones en el mapa?", "id": 4},
        ],
    },
    {
        "title": "Mis derechos como víctima",
        "messages": [
            {"role": "user",      "content": "¿Cuáles son mis derechos si soy víctima de violencia?", "id": 1},
            {"role": "assistant", "content": "Tienes derechos específicos protegidos por la **Ley General de Víctimas** en México:\n\n- Recibir atención médica, psicológica y jurídica gratuita\n- Que se te informe sobre el estado de tu caso\n- A un defensor público gratuito\n- A no ser re-victimizada durante el proceso legal\n- A medidas de protección si hay peligro\n- A reparación del daño\n\nAdemás, tienes derecho a presentar una denuncia sin importar cuánto tiempo haya pasado.\n\n¿Hay alguno de estos derechos sobre el que quieras más información?", "id": 2},
        ],
    },
]


def seed():
    create_tables()
    db = SessionLocal()

    existing = db.query(User).filter(User.email == DEMO_EMAIL).first()
    if existing:
        print(f"⚠️  Demo user already exists (id={existing.id}). Skipping.")
        db.close()
        return

    user = User(
        email=DEMO_EMAIL,
        name=DEMO_NAME,
        city=DEMO_CITY,
        password_hash=hash_password(DEMO_PASSWORD),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    for conv in CONVERSATIONS:
        db.add(Conversation(
            user_id=user.id,
            title=conv["title"],
            messages=json.dumps(conv["messages"], ensure_ascii=False),
        ))
    db.commit()
    db.close()

    print("✓ Demo user created:")
    print(f"  Email:    {DEMO_EMAIL}")
    print(f"  Password: {DEMO_PASSWORD}")
    print(f"  Name:     {DEMO_NAME} · {DEMO_CITY}")
    print(f"  Chats:    {len(CONVERSATIONS)}")


if __name__ == "__main__":
    seed()
