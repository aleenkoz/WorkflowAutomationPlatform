import json

from ollama import chat
from app.services.memory_service import get_relevant_memory, store_chat_memory

""" Functions for Hermes to interact directly with users
and reply to their questions using relevant memory and context
about a specific project. """

CHAT_PROMPT = """
You are Hermes, an AI assistant for a construction intelligence platform.

You will receive:
- A user question
- Relevant project memory
- Relevant meeting memory
- Relevant risk memory
- Relevant material intelligence

Your tasks:
1. Understand the user's question.
2. Use the provided memory to answer accurately.
3. If memory is missing, say so.
4. Respond clearly and concisely.
5. Return ONLY valid JSON:

{
  "answer": "",
  "used_memory": [],
  "new_memory": ""
}
}
"""

def run_chat(db, message, project_id=None):
    # 1. Fetch relevant memory
    memory = get_relevant_memory(db, project_id, message)

    # 2. Build Hermes messages
    messages = [
        {"role": "user", "content": CHAT_PROMPT},
        {"role": "user", "content": f"User message: {message}"},
        {"role": "user", "content": f"Relevant memory: {memory}"}
    ]

    # 3. Call Hermes
    response = chat(
        model="hermes3",
        messages=messages,
        options={"temperature": 0.4}
    )

    raw = response["message"]["content"]
    parsed = json.loads(raw)

    # 4. Store new memory
    if parsed.get("new_memory"):
        store_chat_memory(db, project_id, parsed["new_memory"])

    return parsed["answer"]
