import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from patentsvg import header, footer, box, groupbox, diamond, arrow, elbow, caption, W, H

def save(name, svg):
    os.makedirs("svgfigs", exist_ok=True)
    with open(f"svgfigs/{name}.svg", "w", encoding="utf-8") as f:
        f.write(svg)

# ---------------------------------------------------------------
# FIG. 1 -- Overall Multi-Tenant System Architecture (100)
# ---------------------------------------------------------------
s = header("FIG. 1", "OVERALL MULTI-TENANT SYSTEM ARCHITECTURE")
s += box(660, 105, 280, 55, ["SYSTEM (100)"], weight="bold", size=19)
s += box(80, 220, 260, 90, ["CLIENT INTERFACE", "LAYER"], numeral="102")
s += arrow(660, 160, 340, 230, dash=False)

s += groupbox(430, 220, 500, 260, "APPLICATION GATEWAY SERVER", numeral="104")
s += box(455, 260, 210, 55, ["AUTHENTICATION", "MIDDLEWARE"], numeral="105", numeral_inside=True, size=14)
s += box(455, 335, 210, 55, ["TENANT ISOLATION", "MIDDLEWARE"], numeral="106", numeral_inside=True, size=14)
s += box(455, 410, 210, 55, ["ROLE-BASED ACCESS", "MIDDLEWARE"], numeral="107", numeral_inside=True, size=14)
s += arrow(340, 265, 455, 287)

s += groupbox(1000, 220, 520, 260, "MACHINE LEARNING MICROSERVICE", numeral="110")
s += box(1030, 255, 220, 55, ["NLP VECTOR", "MATCHER MODULE"], numeral="112", numeral_inside=True, size=14)
s += box(1270, 255, 220, 55, ["WEIGHT REDIST.", "ENGINE"], numeral="114", numeral_inside=True, size=14)
s += box(1030, 330, 220, 55, ["THRESHOLD", "PENALTY MODULE"], numeral="116", numeral_inside=True, size=14)
s += box(1270, 330, 220, 55, ["GENERATIVE AI", "MICROSERVICE I/F"], numeral="118", numeral_inside=True, size=14)
s += arrow(940, 300, 1030, 300)

s += box(660, 560, 300, 65, ["PERSISTENT DATABASE", "LAYER"], numeral="108")
s += arrow(700, 480, 760, 560)
s += arrow(1200, 480, 900, 560)

s += box(80, 400, 300, 75, ["CRYPTOGRAPHIC E-SIGNATURE", "ENGINE"], numeral="120", numeral_inside=True)
s += box(80, 500, 145, 55, ["SHA-256 DIGEST", "GENERATOR"], numeral="122", numeral_inside=True, size=13)
s += box(235, 500, 145, 55, ["AUDITOR VERIFICATION", "INTERFACE"], numeral="124", numeral_inside=True, size=12)
s += arrow(430, 350, 340, 420)
s += arrow(210, 475, 210, 500)
s += arrow(300, 560, 700, 590)

s += box(80, 700, 260, 70, ["WELLNESS / STRESS", "TRACKING MODULE"], numeral="126", size=14)
s += box(360, 700, 260, 70, ["ANONYMOUS PEER", "SUPPORT WALL MODULE"], numeral="128", size=14)
s += arrow(210, 685, 500, 490, dash=True)
s += arrow(490, 685, 560, 490, dash=True)

s += caption("FIG. 1 \u2013 Overall multi-tenant system architecture (100).")
save("fig1", s + footer())

# ---------------------------------------------------------------
# FIG. 2 -- NLP Vector Matcher & Dynamic Parameter Weighting (112, 114)
# ---------------------------------------------------------------
s = header("FIG. 2", "NLP VECTOR MATCHER & DYNAMIC PARAMETER WEIGHTING SUB-SYSTEM")
s += groupbox(80, 110, 700, 400, "NLP VECTOR MATCHER MODULE", numeral="112")
s += box(120, 155, 260, 60, ["JOB TEXT T_job /", "CANDIDATE TEXT T_cand"])
s += box(120, 250, 260, 60, ["EMBEDDING FUNCTION", "E(T)  (d = 384)"])
s += box(120, 345, 260, 60, ["COSINE SIMILARITY", "COMPUTATION"])
s += box(120, 440, 260, 55, ["Score_similarity"], weight="bold")
s += arrow(250, 215, 250, 250)
s += arrow(250, 310, 250, 345)
s += arrow(250, 405, 250, 440)

s += box(460, 250, 280, 60, ["EXCEPTION: MODEL", "UNAVAILABLE / OFFLINE"], dash=True)
s += box(460, 345, 280, 60, ["TF-IDF FALLBACK", "VECTORIZER"])
s += box(460, 440, 280, 55, ["Score_TFIDF"], weight="bold")
s += arrow(380, 280, 460, 280, label="on exception")
s += arrow(600, 310, 600, 345)
s += arrow(600, 405, 600, 440)

s += groupbox(880, 110, 640, 400, "PARAMETER WEIGHT REDISTRIBUTION ENGINE", numeral="114")
s += box(920, 155, 260, 60, ["DETECT OMITTED", "CANDIDATE ATTRIBUTE"])
s += box(920, 250, 260, 60, ["EXCLUDE WEIGHT FROM", "ACTIVE WEIGHT SET"])
s += box(920, 345, 260, 60, ["COMPUTE \u03a9_norm =", "\u03a3 ACTIVE WEIGHTS"])
s += box(920, 440, 260, 55, ["RENORMALISE: w\u2032i = wi / \u03a9_norm"], size=14)
s += arrow(1050, 215, 1050, 250)
s += arrow(1050, 310, 1050, 345)
s += arrow(1050, 405, 1050, 440)

s += box(1220, 300, 260, 90, ["COMPOSITE MATCH", "SCORE OUTPUT", "(0.0 \u2013 100.0)"], weight="bold")
s += arrow(1180, 460, 1250, 390)
s += box(300, 570, 1000, 70, ["NOTE: THE SIMILARITY SUB-SCORE OUTPUT BY MODULE (112)", "(Score_similarity OR Score_TFIDF) IS SUPPLIED AS AN INPUT Si TO THE WEIGHT REDISTRIBUTION ENGINE (114)"], size=15, dash=True)
s += caption("FIG. 2 \u2013 NLP vector matcher and dynamic parameter weighting sub-system (112, 114).")
save("fig2", s + footer())

# ---------------------------------------------------------------
# FIG. 3 -- Candidate Scoring & Weight Redistribution Algorithmic Flow
# ---------------------------------------------------------------
s = header("FIG. 3", "CANDIDATE SCORING & WEIGHT REDISTRIBUTION ALGORITHMIC FLOW")
s += box(650, 100, 300, 60, ["RECEIVE JOB SPEC &", "CANDIDATE PROFILES (104)"])
s += box(650, 200, 300, 60, ["COMPUTE SEMANTIC", "SIMILARITY SCORE (112)"])
s += diamond(800, 340, 300, 110, ["CANDIDATE PROFILE", "CONTAINS ACADEMIC", "SCORE VALUE ?"])
s += box(280, 460, 320, 80, ["APPLY RECRUITER WEIGHTS;", "APPLY THRESHOLD PENALTY", "IF g < g_min (116)"])
s += box(950, 460, 340, 80, ["RENORMALISE ACTIVE", "WEIGHTS w\u2032i = wi / \u03a9_norm (114)"])
s += box(650, 600, 300, 60, ["COMPUTE COMPOSITE", "MATCH SCORE"])
s += box(650, 700, 300, 60, ["SORT & OUTPUT CANDIDATE", "RANKINGS TO UI (102)"])

s += arrow(800, 160, 800, 200)
s += arrow(800, 260, 800, 285)
s += arrow(650, 340, 440, 460, label="YES")
s += arrow(950, 340, 1120, 460, label="NO")
s += elbow(440, 540, 800, 600)
s += elbow(1120, 540, 800, 600)
s += arrow(800, 660, 800, 700)
s += caption("FIG. 3 \u2013 Candidate scoring and weight redistribution algorithmic flow.")
save("fig3", s + footer())

# ---------------------------------------------------------------
# FIG. 4 -- Dual-Pipeline Generative AI Workflow (118)
# ---------------------------------------------------------------
s = header("FIG. 4", "DUAL-PIPELINE GENERATIVE AI WORKFLOW")
s += box(660, 100, 280, 60, ["GENERATIVE AI MICROSERVICE", "INTERFACE (118)"], weight="bold")

s += groupbox(60, 220, 460, 300, "PIPELINE A \u2013 PREP MATERIAL", size=15)
s += box(90, 260, 400, 55, ["JOB DRIVE PUBLICATION EVENT"])
s += box(90, 335, 400, 55, ["PROMPT CONSTRUCTION + LLM", "INFERENCE CALL"])
s += box(90, 410, 400, 55, ["OUTPUT: TOPICS, QUESTIONS,", "MILESTONES, APTITUDE AREAS"])
s += arrow(290, 315, 290, 335)
s += arrow(290, 390, 290, 410)

s += groupbox(570, 220, 460, 300, "PIPELINE B \u2013 CAREER REMEDIATION", size=15)
s += box(600, 260, 400, 55, ["CANDIDATE UNPLACED AFTER", "RECRUITMENT CYCLE"])
s += box(600, 335, 400, 55, ["DOMAIN SKILLS + DEPT.", "PATHWAY \u2192 LLM INFERENCE"])
s += box(600, 410, 400, 55, ["OUTPUT: UPSKILLING & CAREER", "TRAJECTORY RECOMMENDATIONS"])
s += arrow(800, 315, 800, 335)
s += arrow(800, 390, 800, 410)

s += groupbox(1080, 220, 460, 300, "PIPELINE C \u2013 CHAT MODERATION", size=15)
s += box(1110, 260, 400, 55, ["CANDIDATE CHAT MESSAGE", "RECEIVED"])
s += box(1110, 335, 400, 55, ["MODERATION PROMPT \u2192", "LLM INFERENCE CALL"])
s += box(1110, 410, 400, 55, ["OUTPUT: SAFE / WARNING /", "CRITICAL + REASONING"])
s += arrow(1310, 315, 1310, 335)
s += arrow(1310, 390, 1310, 410)

s += arrow(750, 160, 290, 260)
s += arrow(800, 160, 800, 260)
s += arrow(850, 160, 1310, 260)
s += caption("FIG. 4 \u2013 Dual-pipeline generative AI workflow (118).")
save("fig4", s + footer())

# ---------------------------------------------------------------
# FIG. 5 -- Chat Toxicity Moderation & Wellness Support Loop (126, 128)
# ---------------------------------------------------------------
s = header("FIG. 5", "CHAT TOXICITY MODERATION & WELLNESS SUPPORT LOOP")
s += box(120, 130, 320, 60, ["STUDENT CHAT / PEER-WALL", "POST SUBMISSION"])
s += box(120, 240, 320, 60, ["API GATEWAY INGESTION (104)"])
s += box(120, 350, 320, 60, ["AI MODERATION FILTER", "(PIPELINE C, 118)"])
s += diamond(280, 480, 300, 110, ["MESSAGE", "FLAGGED ?"])
s += box(120, 600, 300, 55, ["BLOCK / ESCALATE TO", "MODERATOR"])
s += box(460, 600, 300, 55, ["PUBLISH TO ANONYMOUS", "PEER SUPPORT WALL (128)"])
s += arrow(280, 190, 280, 240)
s += arrow(280, 300, 280, 350)
s += arrow(280, 410, 280, 425)
s += arrow(220, 545, 270, 600, label="YES")
s += arrow(340, 545, 560, 600, label="NO")

s += box(880, 130, 320, 60, ["CANDIDATE STRESS", "ENTRY SUBMISSION"])
s += box(880, 240, 320, 60, ["WELLNESS / STRESS", "TRACKING MODULE (126)"])
s += box(880, 350, 320, 60, ["STORED STRESS LEVEL,", "TRIGGER CATEGORY & NOTE"])
s += arrow(1040, 190, 1040, 240)
s += arrow(1040, 300, 1040, 350)
s += caption("FIG. 5 \u2013 Chat toxicity moderation and wellness support loop (126, 128).")
save("fig5", s + footer())

# ---------------------------------------------------------------
# FIG. 6 -- Multi-Tenant Data Governance & Audit Loop
# ---------------------------------------------------------------
s = header("FIG. 6", "MULTI-TENANT DATA GOVERNANCE & AUDIT LOOP")
s += box(80, 140, 260, 60, ["CLIENT INTERFACE", "LAYER (102)"])
s += groupbox(420, 110, 560, 240, "APPLICATION GATEWAY SERVER (104)")
s += box(450, 150, 160, 55, ["AUTH.", "MW (105)"], size=13)
s += box(630, 150, 160, 55, ["TENANT ISOLATION", "MW (106)"], size=12)
s += box(810, 150, 140, 55, ["ROLE-BASED", "MW (107)"], size=13)
s += arrow(340, 170, 450, 177)
s += arrow(610, 177, 630, 177)
s += arrow(790, 177, 810, 177)

s += box(1080, 140, 320, 60, ["TENANT-SCOPED DATABASE", "COLLECTIONS (108)"])
s += arrow(950, 177, 1080, 170)

s += box(420, 420, 320, 60, ["IMMUTABLE AUDIT LOG", "(APPEND-ONLY)"])
s += arrow(1200, 200, 580, 420)

s += box(880, 420, 320, 70, ["EXTERNAL COMPLIANCE", "AUDITOR (124)"])
s += arrow(880, 450, 740, 450, label="INDEPENDENT VERIFY")
s += caption("FIG. 6 \u2013 Multi-tenant data governance and feedback/audit loop.")
save("fig6", s + footer())

# ---------------------------------------------------------------
# FIG. 7 -- Multi-Layer Database & Cache Architecture (108)
# ---------------------------------------------------------------
s = header("FIG. 7", "MULTI-LAYER DATABASE & CACHE ARCHITECTURE")
s += groupbox(120, 130, 620, 480, "PERSISTENT DATABASE LAYER", numeral="108")
s += box(160, 175, 260, 55, ["TENANT / INSTITUTION", "RECORDS"], size=13)
s += box(460, 175, 260, 55, ["CANDIDATE PROFILE", "RECORDS"], size=13)
s += box(160, 260, 260, 55, ["JOB POSTING", "RECORDS"], size=13)
s += box(460, 260, 260, 55, ["CONSENT / UNDERTAKING", "RECORDS"], size=13)
s += box(160, 345, 260, 55, ["IMMUTABLE AUDIT", "LOG RECORDS"], size=13)
s += box(460, 345, 260, 55, ["COMPOUND TENANT + RECORD", "ID INDEX"], size=12)
s += box(200, 460, 460, 60, ["QUERY SCOPING: {tenantId, recordId}", "ENFORCED ON EVERY READ / WRITE"], size=13)

s += groupbox(840, 130, 500, 260, "ML MICROSERVICE LOCAL CACHE", numeral="110")
s += box(880, 190, 420, 60, ["FREQUENTLY-ACCESSED JOB", "POSTING EMBEDDING CACHE"], size=13)
s += box(880, 280, 420, 60, ["REDUCES REPEATED EMBEDDING", "COMPUTATION LOAD"], size=13)
s += arrow(880, 260, 880, 280)
s += arrow(740, 260, 880, 220)
s += caption("FIG. 7 \u2013 Multi-layer database and cache architecture (108).")
save("fig7", s + footer())

# ---------------------------------------------------------------
# FIG. 8 -- Security & Defense-in-Depth Architecture (105, 106, 107)
# ---------------------------------------------------------------
s = header("FIG. 8", "SECURITY & DEFENCE-IN-DEPTH ARCHITECTURE")
s += box(80, 130, 260, 60, ["CLIENT HTTPS", "REQUEST (102)"])
s += box(420, 130, 260, 60, ["AUTHENTICATION", "MIDDLEWARE (105)"])
s += box(760, 130, 260, 60, ["TENANT ISOLATION", "MIDDLEWARE (106)"])
s += box(1100, 130, 260, 60, ["ROLE-BASED ACCESS", "MIDDLEWARE (107)"])
s += box(1100, 260, 260, 60, ["PROTECTED ROUTE", "HANDLER"])

s += arrow(340, 160, 420, 160)
s += arrow(680, 160, 760, 160)
s += arrow(1020, 160, 1100, 160)
s += arrow(1230, 190, 1230, 260)

s += box(420, 320, 260, 55, ["401 UNAUTHORISED"], dash=True, size=14)
s += box(760, 320, 260, 55, ["403 CROSS-TENANT", "FORBIDDEN"], dash=True, size=13)
s += box(1100, 400, 260, 55, ["403 ROLE", "FORBIDDEN"], dash=True, size=14)
s += arrow(500, 190, 500, 320, label="fail", dash=True)
s += arrow(840, 190, 840, 320, label="fail", dash=True)
s += arrow(1170, 190, 1170, 400, label="fail", dash=True)
s += caption("FIG. 8 \u2013 Security and defence-in-depth architecture (105, 106, 107).")
save("fig8", s + footer())

# ---------------------------------------------------------------
# FIG. 9 -- Cryptographic E-Signature & Institutional Consent (120,122,124)
# ---------------------------------------------------------------
s = header("FIG. 9", "CRYPTOGRAPHIC E-SIGNATURE & INSTITUTIONAL CONSENT SUB-SYSTEM")
s += groupbox(80, 110, 620, 200, "E-SIGNATURE ENGINE", numeral="120")
s += box(110, 150, 260, 55, ["MULTI-AUTHORITY ISSUANCE", "ROUTING"], size=13)
s += box(410, 150, 260, 55, ["10 UNDERTAKING SUBJECT", "CATEGORIES"], size=13)
s += box(260, 230, 260, 55, ["PLACEMENT OFFICER /", "DEPT. HOD AUTHORITY"], size=13)
s += arrow(240, 205, 350, 230)
s += arrow(540, 205, 430, 230)

s += box(80, 350, 260, 60, ["STUDENT DIGITAL", "SIGNATURE \u03c3_student"])
s += box(400, 350, 260, 60, ["PARENT CO-SIGNATURE", "\u03c3_parent (IF REQUIRED)"], dash=True)
s += arrow(390, 290, 210, 350)
s += arrow(390, 290, 530, 350)

s += box(760, 400, 340, 80, ["SHA-256 DIGEST GENERATOR", "H_\u03c3 = SHA256(id+sig+ts)"], numeral="122", numeral_inside=True)
s += arrow(340, 380, 760, 430)
s += arrow(530, 380, 760, 440)

s += box(760, 540, 340, 60, ["EXPIRATION STATE MACHINE", "PENDING \u2192 EXPIRED_OVERDUE"])
s += arrow(930, 480, 930, 540)

s += box(1180, 400, 320, 80, ["IMMUTABLE AUDIT LOG /", "TAMPER-EVIDENT RECORD"])
s += arrow(1100, 440, 1180, 440)

s += box(1180, 540, 320, 70, ["AUDITOR VERIFICATION", "INTERFACE (124)"])
s += arrow(1340, 480, 1340, 540)
s += caption("FIG. 9 \u2013 Cryptographic e-signature and institutional consent sub-system (120, 122, 124).")
save("fig9", s + footer())

print("all 9 figures generated")
