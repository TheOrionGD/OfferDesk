import os
import json
import urllib.request
import urllib.error

class GroqLLMService:
    """
    OfferDesk Groq LLM Microservice Integration
    Leverages Groq LLaMA 3.3 70B Versatile for high-speed AI inference.
    """
    def __init__(self):
        self.api_key = os.environ.get("GROQ_API_KEY", "").strip()
        self.model = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile").strip()
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    def is_configured(self) -> bool:
        return bool(self.api_key and not self.api_key.startswith("gsk_sample"))

    def completion(self, prompt: str, system_prompt: str = "You are OfferDesk AI Assistant.") -> Optional[str]:
        if not self.is_configured():
            return None

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1024
        }

        try:
            req = urllib.request.Request(
                self.api_url, 
                data=json.dumps(payload).encode("utf-8"), 
                headers=headers, 
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=12) as response:
                if response.status == 200:
                    resp_data = json.loads(response.read().decode("utf-8"))
                    return resp_data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[GroqLLMService] Error invoking Groq API ({self.model}): {e}")
        return None

    def generate_prep_materials(self, company: str, job_title: str, required_skills: list) -> Optional[dict]:
        prompt = f"""
Generate structured pre-interview preparation materials for candidate applying for position:
- Company: {company}
- Job Title: {job_title}
- Required Skills: {', '.join(required_skills)}

Return ONLY valid raw JSON with keys:
"technicalTopics": [list of 4 strings],
"sampleQuestions": [list of 2 objects each with "question", "category", "difficulty", "recommendedAnswerKey"],
"systemDesignPrep": [list of 3 strings],
"aptitudeFocus": [list of 2 strings]
"""
        system_prompt = "You are an expert technical interviewer and placement coordinator. Respond strictly in JSON."
        raw_output = self.completion(prompt, system_prompt)
        if raw_output:
            try:
                # Extract json block if wrapped in markdown
                if "```json" in raw_output:
                    raw_output = raw_output.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_output:
                    raw_output = raw_output.split("```")[1].strip()
                return json.loads(raw_output)
            except Exception as e:
                print(f"[GroqLLMService] JSON parse error: {e}")
        return None

    def moderate_chat_message(self, message: str) -> Optional[dict]:
        prompt = f"""
Analyze the following student campus chat message for toxic, abusive, or discriminatory content:
Message: "{message}"

Return ONLY valid raw JSON with keys:
"isFlagged": boolean,
"flaggedWords": [list of strings],
"severity": "SAFE" | "WARNING" | "CRITICAL",
"analysis": string
"""
        system_prompt = "You are an AI safety and content moderation filter. Respond strictly in JSON."
        raw_output = self.completion(prompt, system_prompt)
        if raw_output:
            try:
                if "```json" in raw_output:
                    raw_output = raw_output.split("```json")[1].split("```")[0].strip()
                elif "```" in raw_output:
                    raw_output = raw_output.split("```")[1].strip()
                return json.loads(raw_output)
            except Exception as e:
                print(f"[GroqLLMService] Moderation JSON parse error: {e}")
        return None
