import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

try:
    from dotenv import load_dotenv
    root_env_path = Path(__file__).resolve().parents[2] / ".env"
    if root_env_path.exists():
        load_dotenv(dotenv_path=root_env_path)
    load_dotenv()
except ImportError:
    pass

from ats_matcher import NLPVectorMatcher
from groq_service import GroqLLMService

app = FastAPI(
    title="OfferDesk AI ATS & Groq LLM Vector Engine",
    description="Python FastAPI NLP Sentence-Transformers & Groq LLaMA 3.3 70B Candidate Ranking Microservice for OfferDesk SaaS",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

matcher = NLPVectorMatcher()
groq_llm = GroqLLMService()

class WeightsModel(BaseModel):
    skills_weight: float = Field(0.40, ge=0.0, le=1.0)
    projects_weight: float = Field(0.30, ge=0.0, le=1.0)
    gpa_weight: float = Field(0.20, ge=0.0, le=1.0)
    certs_weight: float = Field(0.10, ge=0.0, le=1.0)

class CandidateModel(BaseModel):
    id: str
    name: str
    email: str
    skills: List[str]
    gpa: Optional[float] = None
    bio: Optional[str] = ""
    project_summary: Optional[str] = ""
    certifications: Optional[List[str]] = []

class JobSpecModel(BaseModel):
    id: str
    title: str
    description: str
    required_skills: List[str]
    min_gpa: float
    certifications: Optional[List[str]] = []

class ScoreRequest(BaseModel):
    job_spec: JobSpecModel
    candidates: List[CandidateModel]
    weights: Optional[WeightsModel] = Field(default_factory=WeightsModel)

class PrepGeneratorRequest(BaseModel):
    job_id: str
    company: str
    job_title: str
    description: Optional[str] = ""
    required_skills: List[str]

@app.get("/")
def read_root():
    return {
        "service": "OfferDesk AI ATS & Groq LLM Engine",
        "status": "online",
        "sbert_loaded": matcher.use_sbert,
        "groq_configured": groq_llm.is_configured(),
        "groq_model": groq_llm.model
    }

@app.post("/api/ats/rank-candidates")
def rank_candidates(payload: ScoreRequest):
    try:
        results = []
        weights_dict = payload.weights.dict() if payload.weights else {
            "skills_weight": 0.40, "projects_weight": 0.30, "gpa_weight": 0.20, "certs_weight": 0.10
        }

        for cand in payload.candidates:
            evaluated = matcher.evaluate_candidate(cand.dict(), payload.job_spec.dict(), weights_dict)
            results.append(evaluated)

        results.sort(key=lambda x: x["total_match_score"], reverse=True)

        return {
            "job_id": payload.job_spec.id,
            "total_candidates_scored": len(results),
            "weights_applied": weights_dict,
            "leaderboard": results
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/ai/prep-materials")
def generate_prep_materials(req: PrepGeneratorRequest):
    """
    AI Pre-Interview Study Material Generator powered by Groq LLaMA 3.3 70B.
    """
    if groq_llm.is_configured():
        groq_result = groq_llm.generate_prep_materials(req.company, req.job_title, req.required_skills)
        if groq_result:
            groq_result["jobId"] = req.job_id
            groq_result["company"] = req.company
            groq_result["jobTitle"] = req.job_title
            groq_result["engine"] = f"Groq LLM ({groq_llm.model})"
            return groq_result

    # Fallback template generator
    skills = req.required_skills if req.required_skills else ["Core Computer Science", "Data Structures"]
    primary_skill = skills[0] if skills else "Software Engineering"
    secondary_skill = skills[1] if len(skills) > 1 else "Database Systems"
    
    technical_topics = [
        f"Advanced proficiency in {s}" for s in skills
    ] + [
        f"{req.company} Technical Assessment: Algorithm Complexity & Space Optimization",
        f"Hands-on architectural patterns for {req.job_title}"
    ]
    
    sample_questions = [
        {
            "question": f"How do you implement scalable microservices using {primary_skill} for {req.company}'s production workload?",
            "category": f"{primary_skill} Architecture",
            "difficulty": "Hard",
            "recommendedAnswerKey": f"Demonstrate modular component design, fault tolerance, caching with Redis, and async processing using {primary_skill}."
        },
        {
            "question": f"Explain memory management, performance profiling, and optimization techniques in {secondary_skill}.",
            "category": f"{secondary_skill} Deep Dive",
            "difficulty": "Medium",
            "recommendedAnswerKey": f"Detail memory allocation, garbage collection / indexing strategies, and profiling bottlenecks in {secondary_skill}."
        }
    ]
    
    system_design_prep = [
        f"Distributed Caching & Real-Time Data Pipelines using {primary_skill}",
        f"Database Schema Design, Indexing & Query Optimization for {secondary_skill}",
        f"API Gateway Security, Token Bucket Rate Limiting & Service Mesh"
    ]
    
    aptitude_focus = [
        "Data Interpretation & Quantitative Metrics Analysis",
        "Algorithmic Logic, Trees & Graph Traversal Efficiency"
    ]
    
    return {
        "jobId": req.job_id,
        "company": req.company,
        "jobTitle": req.job_title,
        "technicalTopics": technical_topics,
        "sampleQuestions": sample_questions,
        "systemDesignPrep": system_design_prep,
        "aptitudeFocus": aptitude_focus,
        "engine": "Standard Dynamic Engine (Configure GROQ_API_KEY for Groq LLaMA 3.3)"
    }

class ChatModerationRequest(BaseModel):
    message: str
    sender_id: str
    sender_role: str

@app.post("/api/ai/moderate-chat")
def moderate_chat(req: ChatModerationRequest):
    """
    AI Chat Moderation powered by Groq LLaMA 3.3 70B.
    """
    if groq_llm.is_configured():
        groq_mod = groq_llm.moderate_chat_message(req.message)
        if groq_mod:
            groq_mod["engine"] = f"Groq LLM ({groq_llm.model})"
            return groq_mod

    text_lower = req.message.lower()
    toxic_words = [
        "hate", "stupid", "idiot", "dumb", "fool", "crap", "bastard", 
        "racist", "trash", "useless", "abuse", "fraud", "bitch", "scam"
    ]
    detected = [w for w in toxic_words if w in text_lower]
    is_toxic = len(detected) > 0
    
    return {
        "isFlagged": is_toxic,
        "flaggedWords": detected,
        "severity": "CRITICAL" if len(detected) > 1 else ("WARNING" if is_toxic else "SAFE"),
        "analysis": "Toxicity and discriminatory language detected in English text" if is_toxic else "Message cleared safety filter.",
        "engine": "Standard Keyword Safety Filter (Configure GROQ_API_KEY for Groq LLaMA 3.3)"
    }

class NonPlacementReqModel(BaseModel):
    user_id: str
    domain: str
    skills: Optional[List[str]] = []
    hod_pathway: Optional[Dict[str, Any]] = None

@app.post("/api/ai/non-placement-recommendations")
def get_non_placement_recommendations(req: NonPlacementReqModel):
    """
    Dynamic AI Recommendation Engine for HOD-Curated & User-Given Non-Placement Pathways.
    Analyzes HOD criteria, sector roles, and candidate skill vectors to generate tailored preparation advice.
    """
    domain = req.domain or "HIGHER_STUDIES_GATE"
    user_skills = req.skills or ["Engineering Fundamentals", "Mathematics"]
    hod = req.hod_pathway

    if hod:
        title = hod.get("title", f"HOD Curated Track ({domain})")
        vision = hod.get("visionNote", "Department HOD Customized Pathway")
        
        # Build recommendations from HOD blueprint and criteria
        recommendations = []
        if hod.get("criteria") and hod["criteria"].get("cutoffScoreNote"):
            recommendations.append(f"HOD Target Target & Cutoff: {hod['criteria']['cutoffScoreNote']}")
        
        for item in hod.get("actionBlueprint", []):
            recommendations.append(f"{item.get('semester', 'Sem')}: {item.get('taskTitle')} - {item.get('description')}")
        
        if not recommendations:
            recommendations = [
                "HOD Curated Pathway Syllabus Review & Target Setting",
                "Departmental Academic Sign-Off & Project Alignment",
                "Official Portal Registration & Mock Test Sandbox Practice"
            ]

        job_links = []
        for r in hod.get("resources", []):
            job_links.append({"title": r.get("title", "Resource"), "type": r.get("type", "Portal"), "url": r.get("url", "https://google.com")})
        
        for role in hod.get("roles", []):
            if role.get("topEmployers"):
                emp_str = ", ".join(role["topEmployers"][:2])
                job_links.append({"title": f"{role.get('roleTitle')} ({emp_str})", "type": "Sector Role", "url": "https://linkedin.com"})

        return {
            "userId": req.user_id,
            "domain": domain,
            "title": title,
            "visionNote": vision,
            "isHodCustomized": hod.get("isHodCustomized", True),
            "creatorName": hod.get("creatorName", "Department HOD"),
            "recommendedSkills": list(set(user_skills + ["Technical Communication", "Analytical Problem Solving"])),
            "recommendations": recommendations,
            "jobLinks": job_links
        }

    # Baseline fallback if no HOD pathway object passed
    if domain == "HIGHER_STUDIES_GATE":
        title = "GATE Engineering & M.Tech Research Pathways"
        recommendations = [
            "National NPTEL GATE Online Test Series & PYQ Practice",
            "IISc & IIT M.Tech Research Assistantship Applications",
            "BARC Scientific Officer & Direct PSU Entrance Exam Prep"
        ]
        job_links = [
            {"title": "IISc Bangalore M.Tech Research Admissions", "type": "Research", "url": "https://iisc.ac.in/admissions"},
            {"title": "BARC Scientific Officer GATE Cutoff Portal", "type": "PSU Job", "url": "https://barc.gov.in"}
        ]
    elif domain == "GOVT_EXAMS_UPSC":
        title = "UPSC Civil Services, IES & Central Govt Exams"
        recommendations = [
            "Indian Engineering Services (IES) Technical Paper Mastery",
            "UPSC Prelims & Mains General Studies Current Affairs Stream",
            "Public Sector Undertakings (PSUs) Executive Direct Entries"
        ]
        job_links = [
            {"title": "UPSC Official Portal", "type": "Govt Exam", "url": "https://upsc.gov.in"},
            {"title": "Press Information Bureau (PIB) News Feed", "type": "Current Affairs", "url": "https://pib.gov.in"}
        ]
    elif domain == "OFF_CAMPUS_JOBS":
        title = "Direct Off-Campus Corporate Tech & Engineering Jobs"
        recommendations = [
            "GitHub Open Source Contributions & Production Repositories",
            "LeetCode Hard Algorithms & System Design Blueprints",
            "Direct Referral Networking on LinkedIn & Technical Hackathons"
        ]
        job_links = [
            {"title": "LeetCode Coding Sandbox", "type": "Coding Sandbox", "url": "https://leetcode.com"},
            {"title": "GitHub Developer Hub", "type": "Open Source", "url": "https://github.com"}
        ]
    else:
        title = "Entrepreneurship & University Incubator Pathway"
        recommendations = [
            "DPIIT Startup India Seed Fund Application Blueprint",
            "MVP Prototyping & No-Code Technology Workshops",
            "Venture Capital Pitch Deck & Term Sheet Principles"
        ]
        job_links = [
            {"title": "Startup India Official Portal", "type": "Grant Portal", "url": "https://startupindia.gov.in"},
            {"title": "Y Combinator Startup School", "type": "Incubator", "url": "https://startupschool.org"}
        ]

    return {
        "userId": req.user_id,
        "domain": domain,
        "title": title,
        "recommendedSkills": user_skills + ["System Design", "Technical Communication"],
        "recommendations": recommendations,
        "jobLinks": job_links
    }


