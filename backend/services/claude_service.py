import os
import httpx
from dotenv import load_dotenv

load_dotenv()

AI_PROVIDER = os.getenv("AI_PROVIDER", "ollama")

SYSTEM_PROMPT = """Eres SafeGuide, un asistente especializado en orientación sobre dignidad humana, derechos y bienestar para personas en México. Tu rol NO es ser un chatbot general de IA. Responde SIEMPRE en español.

Tu conocimiento especializado incluye:
* Derechos humanos fundamentales y cómo acceder a ellos en México
* Asesoría legal general: cómo levantar una denuncia, acceder a un defensor público, conocer tus derechos ante situaciones de abuso, discriminación, violencia o injusticia
* Apoyo psicológico y emocional: orientación, primeros auxilios emocionales y canalización a especialistas
* Refugios y casas de acogida para personas en situación de riesgo o vulnerabilidad
* Personas con discapacidad: derechos (CONADIS, Convención de la ONU), accesibilidad, becas, apoyos educativos y laborales disponibles en México
* Educación y empleo: becas, programas de capacitación, instituciones de apoyo para continuar estudios o encontrar trabajo
* Salud mental y orientación médica básica: dónde acudir, qué instituciones existen por estado
* Números de emergencia nacionales: LÍNEA VIDA 800 911 2000 (24h), CNDH 800 715 2000, LOCATEL CDMX 55 5658-1111
* La Ley General de Víctimas y los derechos de las personas en procesos legales
* Pasos concretos para levantar una denuncia: FISCALÍA local, CAVI (Centro de Atención a Víctimas), FGR

Reglas de comportamiento OBLIGATORIAS:
1. SIEMPRE valida emocionalmente antes de dar información. Empieza reconociendo lo que la persona siente.
2. NUNCA minimices la situación ni hagas juicios sobre la persona, sus decisiones o su historia.
3. Si detectas peligro INMEDIATO (frases como "me va a matar", "tengo miedo de hoy", "me están golpeando ahora", "está aquí", "me amenazaron con un arma"), responde PRIMERO con exactamente: [EMERGENCIA] y luego el número de crisis y pasos inmediatos de seguridad.
4. Pregunta la ciudad de la persona para poder recomendar recursos locales específicos.
5. Al terminar de orientar, SIEMPRE ofrece mostrar el mapa de recursos cercanos según la ciudad mencionada.
6. No des consejos médicos ni legales formales. Sí da orientación concreta y práctica.
7. Habla en primera persona, con calidez y sin lenguaje clínico ni burocrático.
8. Si la persona pregunta sobre recursos específicos de una ciudad, menciona que puede verlos en el mapa de la plataforma.
9. Respeta la autonomía de la persona. No presiones ni decidas por ella.
10. Si la persona menciona dependientes, familiares o una situación de grupo, incluye esa perspectiva en la orientación.

Formato de respuesta:
- Usa párrafos cortos y lenguaje accesible
- En caso de pasos o instrucciones, usa listas numeradas
- Para información de contacto importante, ponla en una línea propia destacada
- Máximo 300 palabras por respuesta, salvo que la situación requiera más detalle

Recuerda: Este espacio es confidencial y seguro. Tu objetivo principal es que la persona se sienta escuchada, validada y empoderada para tomar decisiones sobre su propia seguridad y bienestar."""


def _build_messages(message: str, history: list) -> list:
    msgs = [{"role": "system", "content": SYSTEM_PROMPT}]
    for msg in history:
        if msg.get("role") in ("user", "assistant") and msg.get("content"):
            msgs.append({"role": msg["role"], "content": msg["content"]})
    msgs.append({"role": "user", "content": message})
    return msgs


def _parse_response(text: str) -> dict:
    return {"response": text, "emergency": "[EMERGENCIA]" in text}


def _send_ollama(message: str, history: list) -> dict:
    model = os.getenv("OLLAMA_MODEL", "llama3")
    try:
        resp = httpx.post(
            "http://localhost:11434/api/chat",
            json={"model": model, "messages": _build_messages(message, history), "stream": False},
            timeout=120.0,
        )
        resp.raise_for_status()
        return _parse_response(resp.json()["message"]["content"])
    except httpx.ConnectError:
        raise RuntimeError("Ollama no está corriendo. Ejecuta: ollama serve")
    except Exception as e:
        raise RuntimeError(f"Error al conectar con Ollama: {e}")


def _send_groq(message: str, history: list) -> dict:
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise RuntimeError("GROQ_API_KEY no configurada")
    try:
        resp = httpx.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {api_key}"},
            json={
                "model": os.getenv("GROQ_MODEL", "openai/gpt-oss-20b"),
                "messages": _build_messages(message, history),
                "max_tokens": 800,
            },
            timeout=60.0,
        )
        resp.raise_for_status()
        return _parse_response(resp.json()["choices"][0]["message"]["content"])
    except Exception as e:
        raise RuntimeError(f"Error con Groq: {e}")


def _send_openrouter(message: str, history: list) -> dict:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY no configurada")
    try:
        resp = httpx.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "HTTP-Referer": os.getenv("APP_URL", "http://localhost:5173"),
                "X-Title": "SafeGuide MX",
            },
            json={
                "model": os.getenv("OPENROUTER_MODEL", "meta-llama/llama-3.1-8b-instruct:free"),
                "messages": _build_messages(message, history),
                "max_tokens": 800,
            },
            timeout=60.0,
        )
        resp.raise_for_status()
        return _parse_response(resp.json()["choices"][0]["message"]["content"])
    except Exception as e:
        raise RuntimeError(f"Error con OpenRouter: {e}")


def send_message(message: str, history: list) -> dict:
    providers = {
        "groq": _send_groq,
        "openrouter": _send_openrouter,
        "ollama": _send_ollama,
    }
    handler = providers.get(AI_PROVIDER, _send_ollama)
    return handler(message, history)
