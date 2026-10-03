import pptx

prs = pptx.Presentation(r'o:\OfferDesk\OfferDesk_Patent_Figures_SmartArt  -  Repaired.pptx')

# Mappings for replacement per slide
# We iterate over textframes and paragraphs or replace matching text strings

def replace_in_shape(shape, old_str, new_str):
    if not shape.has_text_frame:
        return False
    changed = False
    for p in shape.text_frame.paragraphs:
        if old_str in p.text:
            p.text = p.text.replace(old_str, new_str)
            changed = True
    return changed

# SLIDE 1
slide1 = prs.slides[0]
replace_in_shape(slide1.shapes[0], "Overall Multi-Tenant System Architecture", "Overall Multi-Tenant System Architecture (100)")
replace_in_shape(slide1.shapes[7], "Client Layer", "Client Interface Layer (102)")
replace_in_shape(slide1.shapes[19], "Auditor Dashboard", "Auditor Dashboard (124)")
replace_in_shape(slide1.shapes[22], "API Security Gateway", "Application Gateway Server (104)")
replace_in_shape(slide1.shapes[26], "JWT Token Auth", "Authentication Middleware (105)")
replace_in_shape(slide1.shapes[28], "requireTenantId Gate", "Tenant Isolation Middleware (106)")
replace_in_shape(slide1.shapes[30], "requireRole RBAC Gate", "Role-Based Access Middleware (107)")
replace_in_shape(slide1.shapes[32], "Audit Logger & E-Signatures", "Cryptographic E-Signature Engine (120)")
replace_in_shape(slide1.shapes[35], "Python AI Microservice", "Machine Learning Microservice (110)")
replace_in_shape(slide1.shapes[39], "NLP Vector Matcher Engine", "NLP Vector Matcher Module (112)")
replace_in_shape(slide1.shapes[43], "Parameter Re-Weighting", "Parameter Weight Redistribution Engine (114)")
replace_in_shape(slide1.shapes[45], "Groq LLaMA 3.3 70B LLM", "Generative AI Microservice Interface (118)")
replace_in_shape(slide1.shapes[47], "Chat Toxicity Filter", "Threshold Penalty Module (116)")
replace_in_shape(slide1.shapes[50], "Database & Storage", "Persistent Database Layer (108)")
replace_in_shape(slide1.shapes[60], "Wellness, Undertakings & Hashes", "Wellness (126), Undertakings (120) & Hashes (122)")

# SLIDE 2
slide2 = prs.slides[1]
replace_in_shape(slide2.shapes[0], "Python AI Scoring & Vector Matcher Sub-System", "Python AI Scoring & Vector Matcher Sub-System (112, 114)")
replace_in_shape(slide2.shapes[4], "NLP Vector Matcher (ats_matcher.py)", "NLP Vector Matcher Module (112)")
replace_in_shape(slide2.shapes[26], "Eligibility Penalty Model", "Threshold Eligibility Penalty Module (116)")
replace_in_shape(slide2.shapes[36], "Weight Redistribution Matrix", "Parameter Weight Redistribution Engine (114)")

# SLIDE 3
slide3 = prs.slides[2]
replace_in_shape(slide3.shapes[0], "Candidate Scoring & Weight Redistribution Flow", "Candidate Scoring & Weight Redistribution Flow (100)")
replace_in_shape(slide3.shapes[7], "Job Spec Input", "Job Spec Input (104)")
replace_in_shape(slide3.shapes[13], "Candidate Profile Data", "Candidate Profile Data (102, 108)")
replace_in_shape(slide3.shapes[19], "SBERT Vector Encoder", "SBERT Vector Encoder (112)")
replace_in_shape(slide3.shapes[25], "Weight Redistribution Engine", "Weight Redistribution Engine (114)")
replace_in_shape(slide3.shapes[37], "Threshold Penalty Check", "Threshold Penalty Check (116)")
replace_in_shape(slide3.shapes[43], "Composite Matrix Score", "Composite Matrix Score (110)")
replace_in_shape(slide3.shapes[48], "Sorted Match Output", "Sorted Match Output (102)")

# SLIDE 4
slide4 = prs.slides[3]
replace_in_shape(slide4.shapes[0], "Dual-Pipeline Generative AI Workflow", "Dual-Pipeline Generative AI Workflow (118)")
replace_in_shape(slide4.shapes[6], "Job Drive Publication Event", "Job Drive Publication Event (104)")
replace_in_shape(slide4.shapes[11], "Groq LLM Prompt Synthesis", "Groq LLM Prompt Synthesis (118)")
replace_in_shape(slide4.shapes[16], "Technical Study Topics Synthesizer", "Technical Study Topics Synthesizer (118)")
replace_in_shape(slide4.shapes[21], "Interview Q&A Key Generator", "Interview Q&A Key Generator (118)")
replace_in_shape(slide4.shapes[26], "Drive Prep Material Storage", "Drive Prep Material Storage (108)")
replace_in_shape(slide4.shapes[31], "Non-Placement Trigger Event", "Non-Placement Trigger Event (104)")
replace_in_shape(slide4.shapes[36], "Upskilling Pathway Synthesizer", "Upskilling Pathway Synthesizer (118)")
replace_in_shape(slide4.shapes[41], "Alternate Career Vector Output", "Alternate Career Vector Output (118)")

# SLIDE 5
slide5 = prs.slides[4]
replace_in_shape(slide5.shapes[0], "Chat Toxicity Moderation & Wellness Support Loop", "Chat Toxicity Moderation & Wellness Support Loop (126, 128)")
replace_in_shape(slide5.shapes[4], "Student Chat / Wall Post", "Student Chat / Wall Post (102)")
replace_in_shape(slide5.shapes[7], "API Gateway Ingestion", "API Gateway Ingestion (104)")
replace_in_shape(slide5.shapes[10], "Groq AI Safety Filter", "Groq AI Safety Filter (118)")
replace_in_shape(slide5.shapes[13], "Toxicity Analysis Engine", "Toxicity Analysis Engine (118)")
replace_in_shape(slide5.shapes[18], "SAFE Post Unit", "SAFE Post Unit (128)")
replace_in_shape(slide5.shapes[22], "Quantitative Stress Tracker", "Quantitative Stress Tracker (126)")
replace_in_shape(slide5.shapes[25], "Anonymous Peer Support Wall", "Anonymous Peer Support Wall (128)")
replace_in_shape(slide5.shapes[28], "Mental Health Guidance Loop", "Mental Health Guidance Loop (126)")

# SLIDE 6
slide6 = prs.slides[5]
replace_in_shape(slide6.shapes[4], "DOUBLE-GATED TENANT ISOLATION & AUDIT ENGINE", "DOUBLE-GATED TENANT ISOLATION (105, 106, 107) & AUDIT ENGINE (124)")
replace_in_shape(slide6.shapes[6], "1. System Admin", "1. System Admin (102)")
replace_in_shape(slide6.shapes[8], "2. Tenant Admin", "2. Tenant Admin (102)")
replace_in_shape(slide6.shapes[10], "3. Dept Coordinator", "3. Dept Coordinator (102)")
replace_in_shape(slide6.shapes[12], "4. Corporate Recruiter", "4. Corporate Recruiter (102)")
replace_in_shape(slide6.shapes[14], "5. Candidate / Student", "5. Candidate / Student (102)")
replace_in_shape(slide6.shapes[16], "6. Evaluator", "6. Evaluator (102)")
replace_in_shape(slide6.shapes[18], "7. System Auditor", "7. System Auditor (124)")

# SLIDE 7
slide7 = prs.slides[6]
replace_in_shape(slide7.shapes[0], "Multi-Layer Database & Cache Architecture", "Multi-Layer Database & Cache Architecture (108, 110)")
replace_in_shape(slide7.shapes[4], "OfferDesk Data Persistence Layer", "OfferDesk Data Persistence Layer (108)")
replace_in_shape(slide7.shapes[6], "Primary MongoDB Store", "Primary MongoDB Store (108)")
replace_in_shape(slide7.shapes[17], "AI Microservice Memory", "AI Microservice Local Cache (110)")
replace_in_shape(slide7.shapes[35], "Immutable Audit Logs & StudentConsent Hashes", "Immutable Audit Logs (108) & StudentConsent Hashes (122)")

# SLIDE 8
slide8 = prs.slides[7]
replace_in_shape(slide8.shapes[0], "Security & Defense-in-Depth Architecture", "Security & Defense-in-Depth Architecture (105, 106, 107)")
replace_in_shape(slide8.shapes[4], "Client HTTPS Request", "Client HTTPS Request (102)")
replace_in_shape(slide8.shapes[8], "JWT Authentication", "Authentication Middleware (105)")
replace_in_shape(slide8.shapes[12], "requireTenantId Gate", "Tenant Isolation Middleware (106)")
replace_in_shape(slide8.shapes[16], "requireRole RBAC Gate", "Role-Based Access Middleware (107)")
replace_in_shape(slide8.shapes[20], "API Route Execution", "API Gateway Route Execution (104)")

# SLIDE 9
slide9 = prs.slides[8]
replace_in_shape(slide9.shapes[0], "Cryptographic E-Signature & Institutional Consent Sub-System", "Cryptographic E-Signature & Institutional Consent Sub-System (120, 122, 124)")
replace_in_shape(slide9.shapes[3], "1. Multi-Authority Issuance Routing", "1. Multi-Authority Issuance Routing (E-Signature Engine 120)")
replace_in_shape(slide9.shapes[4], "2. 10 Institutional Subject Categories", "2. 10 Institutional Subject Categories (Engine 120)")
replace_in_shape(slide9.shapes[5], "3. Cryptographic SHA-256 Hash Engine", "3. Cryptographic SHA-256 Hash Engine (Digest Generator 122 & Auditor Verifier 124)")

prs.save(r'o:\OfferDesk\OfferDesk_Patent_Figures_SmartArt  -  Repaired.pptx')
print("Successfully updated PowerPoint slides with reference numerals from gen.py!")
