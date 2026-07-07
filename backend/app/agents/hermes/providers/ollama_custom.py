import requests

class OllamaCustomProvider:
    def __init__(self, model: str):
        self.model = model
        self.url = "http://localhost:11434/api/generate"

    def run(self, prompt: str):
        payload = {
            "model": self.model,
            "prompt": prompt,
            "stream": False
        }

        response = requests.post(self.url, json=payload)
        response.raise_for_status()

        data = response.json()
        return data.get("response", "")
