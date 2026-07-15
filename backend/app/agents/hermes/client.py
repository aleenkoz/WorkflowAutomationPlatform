from ollama import chat

""" Client for interacting with the Hermes AI model.
This client provides a simple interface to send prompts to the Hermes model and receive responses."""

class Hermes:
    def __init__(self, model="hermes3"):
        self.model = model

    def run(self, prompt: str):
        response = chat(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
        )
        return response["message"]["content"]

hermes = Hermes(model="hermes3")
