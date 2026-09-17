import math
import re
from typing import List, Dict, Any

class NLPVectorMatcher:
    """
    NLP Cosine Vector Similarity & Weighted Ranking Engine for ATS Candidates.
    Combines BERT/SBERT semantic sentence embeddings with recruiter weight metrics:
    - Core Skills % (e.g. 40%)
    - Project Experience % (e.g. 30%)
    - Academic GPA % (e.g. 20%)
    - Certifications % (e.g. 10%)
    """

    def __init__(self):
        self.use_sbert = False
        try:
            import os
            from sentence_transformers import SentenceTransformer
            model_name = os.getenv('SBERT_MODEL_NAME', 'all-MiniLM-L6-v2')
            self.model = SentenceTransformer(model_name)
            self.use_sbert = True
        except Exception:
            self.model = None

    def tokenize(self, text: str) -> List[str]:
        text = text.lower()
        words = re.findall(r'\b\w+\b', text)
        return words

    def tfidf_cosine_similarity(self, text1: str, text2: str) -> float:
        words1 = self.tokenize(text1)
        words2 = self.tokenize(text2)
        if not words1 or not words2:
            return 0.0
        
        vocab = set(words1 + words2)
        v1 = [words1.count(w) for w in vocab]
        v2 = [words2.count(w) for w in vocab]
        
        dot_product = sum(a * b for a, b in zip(v1, v2))
        mag1 = math.sqrt(sum(a * a for a in v1))
        mag2 = math.sqrt(sum(b * b for b in v2))
        
        if mag1 == 0 or mag2 == 0:
            return 0.0
        return dot_product / (mag1 * mag2)

    def calculate_sbert_similarity(self, text1: str, text2: str) -> float:
        if not self.use_sbert or not self.model:
            return self.tfidf_cosine_similarity(text1, text2)
        
        embeddings = self.model.encode([text1, text2])
        emb1, emb2 = embeddings[0], embeddings[1]
        
        dot = sum(a * b for a, b in zip(emb1, emb2))
        m1 = math.sqrt(sum(a * a for a in emb1))
        m2 = math.sqrt(sum(b * b for b in emb2))
        
        if m1 == 0 or m2 == 0:
            return 0.0
        return float(dot / (m1 * m2))

    def evaluate_candidate(self, candidate: Dict[str, Any], job_spec: Dict[str, Any], weights: Dict[str, float]) -> Dict[str, Any]:
        """
        Evaluate candidate against job description with user-defined weights.
        """
        if job_spec.get("min_gpa") is None:
            raise ValueError("min_gpa is required in job_spec for ATS candidate evaluation.")

        min_gpa = float(job_spec["min_gpa"])

        w_skills = weights.get("skills_weight", 0.40)
        w_projects = weights.get("projects_weight", 0.30)
        w_gpa = weights.get("gpa_weight", 0.20)
        w_certs = weights.get("certs_weight", 0.10)

        # 1. Skills match
        job_skills = " ".join(job_spec.get("required_skills", []))
        cand_skills = " ".join(candidate.get("skills", []))
        skills_score = self.calculate_sbert_similarity(job_skills, cand_skills) * 100.0

        # 2. Project experience match
        job_desc = job_spec.get("description", "")
        cand_experience = candidate.get("project_summary", "") or candidate.get("bio", "")
        project_score = self.calculate_sbert_similarity(job_desc, cand_experience) * 100.0

        # 3. GPA score & missing GPA handling
        cand_gpa_val = candidate.get("gpa")
        gpa_provided = cand_gpa_val is not None
        gpa_score = None

        if gpa_provided:
            cand_gpa = float(cand_gpa_val)
            gpa_score_raw = min(100.0, max(0.0, (cand_gpa / 10.0) * 100.0))
            if cand_gpa < min_gpa:
                gpa_score_raw *= 0.7  # penalty for under-eligibility
            gpa_score = round(gpa_score_raw, 1)

        # 4. Certifications match
        req_certs = " ".join(job_spec.get("certifications", []))
        cand_certs = " ".join(candidate.get("certifications", []))
        certs_score = 100.0 if not req_certs else (self.calculate_sbert_similarity(req_certs, cand_certs) * 100.0)

        # Composite score calculation
        if gpa_provided:
            total_score = round(
                (skills_score * w_skills) +
                (project_score * w_projects) +
                (gpa_score * w_gpa) +
                (certs_score * w_certs), 1
            )
        else:
            # Distribute GPA weight proportionally among skills, projects, and certs
            norm = w_skills + w_projects + w_certs
            w_skills_adj = w_skills / norm if norm > 0 else 0.4
            w_projects_adj = w_projects / norm if norm > 0 else 0.4
            w_certs_adj = w_certs / norm if norm > 0 else 0.2
            total_score = round(
                (skills_score * w_skills_adj) +
                (project_score * w_projects_adj) +
                (certs_score * w_certs_adj), 1
            )

        scoring_method = "sbert" if self.use_sbert and self.model else "tfidf"

        return {
            "candidate_id": candidate.get("id"),
            "candidate_name": candidate.get("name"),
            "email": candidate.get("email"),
            "total_match_score": total_score,
            "scoring_method": scoring_method,
            "gpa_provided": gpa_provided,
            "breakdown": {
                "skills_score": round(skills_score, 1),
                "project_score": round(project_score, 1),
                "gpa_score": gpa_score,
                "certs_score": round(certs_score, 1)
            },
            "recommendation": "Strong Match" if total_score >= 75 else ("Potential Fit" if total_score >= 55 else "Needs Skill Review")
        }
