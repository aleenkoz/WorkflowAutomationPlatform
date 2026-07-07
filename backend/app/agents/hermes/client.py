from ollama import chat

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
