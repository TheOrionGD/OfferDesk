import os
import sys
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.dml import MSO_LINE_DASH_STYLE

# Initialize presentation
prs = pptx.Presentation()

# A4 dimensions in Landscape: Width = 11.69 inches (29.7 cm), Height = 8.27 inches (21.0 cm)
prs.slide_width = Inches(11.69)
prs.slide_height = Inches(8.27)

# Margins under Indian Patent Office Rule 15 & USPTO 37 CFR 1.84:
# Top: 4 cm = 1.57 in
# Left: 4 cm = 1.57 in
# Bottom: 3 cm = 1.18 in
# Right: 3 cm = 1.18 in

canvas_left = Inches(1.40)
canvas_top = Inches(1.20)
canvas_width = Inches(11.69 - 1.40 - 1.0)  # ~9.29 in
canvas_height = Inches(8.27 - 1.20 - 1.0) # ~6.07 in

scale_x = canvas_width / Inches(16.0)
scale_y = canvas_height / Inches(9.0)

def to_x(val):
    return canvas_left + Inches((val / 100.0) * scale_x)

def to_y(val):
    return canvas_top + Inches((val / 100.0) * scale_y)

def to_w(val):
    return Inches((val / 100.0) * scale_x)

def to_h(val):
    return Inches((val / 100.0) * scale_y)

blank_slide_layout = prs.slide_layouts[6]

def add_form2_header_footer(slide, sheet_num, total_sheets, fig_title):
    # Background - White
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RGBColor(255, 255, 255)
    
    # Outer Border Frame (Rule 15 Margin Bounding Box)
    border = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.5), Inches(0.4), Inches(10.69), Inches(7.47))
    border.fill.background()
    border.line.color.rgb = RGBColor(180, 180, 180)
    border.line.width = Pt(0.75)
    border.line.dash_style = MSO_LINE_DASH_STYLE.DASH

    # Top Left Header: Applicant Identification
    header_left = slide.shapes.add_textbox(Inches(0.6), Inches(0.5), Inches(6.0), Inches(0.5))
    tf_l = header_left.text_frame
    p_l = tf_l.paragraphs[0]
    p_l.text = "APPLICANT: OFFERDESK / CAMPUSPLACE\nTITLE: MULTI-TENANT SYSTEM & DYNAMIC MATCHING ENGINE"
    p_l.font.size = Pt(8.5)
    p_l.font.bold = True
    p_l.font.color.rgb = RGBColor(0, 0, 0)
    p_l.font.name = "Arial"

    # Top Right Header: Form 2 Rule 15 Sheet Numbering
    header_right = slide.shapes.add_textbox(Inches(7.0), Inches(0.5), Inches(4.0), Inches(0.5))
    tf_r = header_right.text_frame
    p_r = tf_r.paragraphs[0]
    p_r.alignment = PP_ALIGN.RIGHT
    p_r.text = f"SHEET {sheet_num} OF {total_sheets}\nFORM 2 - PATENT DRAWINGS (RULE 15)"
    p_r.font.size = Pt(8.5)
    p_r.font.bold = True
    p_r.font.color.rgb = RGBColor(0, 0, 0)
    p_r.font.name = "Arial"

    # Bottom Caption: FIG. X
    footer = slide.shapes.add_textbox(Inches(1.0), Inches(7.45), Inches(9.69), Inches(0.4))
    tf_f = footer.text_frame
    p_f = tf_f.paragraphs[0]
    p_f.alignment = PP_ALIGN.CENTER
    p_f.text = fig_title.upper()
    p_f.font.size = Pt(10.5)
    p_f.font.bold = True
    p_f.font.color.rgb = RGBColor(0, 0, 0)
    p_f.font.name = "Arial"

def add_box(slide, x, y, w, h, lines, numeral=None, numeral_inside=False, dash=False, weight="normal", size=10):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, to_x(x), to_y(y), to_w(w), to_h(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(255, 255, 255)
    shape.line.color.rgb = RGBColor(0, 0, 0)
    shape.line.width = Pt(1.5 if weight == "bold" else 1.0)
    if dash:
        shape.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    
    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    tf.margin_top = Inches(0.04)
    tf.margin_bottom = Inches(0.04)
    
    text_content = list(lines)
    if numeral and numeral_inside:
        if not any(f"({numeral})" in line for line in text_content):
            text_content[-1] += f" ({numeral})"
    
    for idx, line in enumerate(text_content):
        if idx == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = line
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(size)
        p.font.color.rgb = RGBColor(0, 0, 0)
        p.font.name = "Arial"
        if weight == "bold":
            p.font.bold = True

    if numeral and not numeral_inside:
        num_tb = slide.shapes.add_textbox(to_x(x + w - 40), to_y(y - 18), Inches(0.8), Inches(0.3))
        tf_n = num_tb.text_frame
        p_n = tf_n.paragraphs[0]
        p_n.text = f"({numeral})"
        p_n.font.size = Pt(10)
        p_n.font.bold = True
        p_n.font.color.rgb = RGBColor(0, 0, 0)
        p_n.font.name = "Arial"

def add_groupbox(slide, x, y, w, h, title, numeral=None, size=10):
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, to_x(x), to_y(y), to_w(w), to_h(h))
    shape.fill.background()
    shape.line.color.rgb = RGBColor(0, 0, 0)
    shape.line.width = Pt(1.25)
    shape.line.dash_style = MSO_LINE_DASH_STYLE.DASH
    
    title_text = f"{title}"
    if numeral:
        title_text += f" ({numeral})"
    
    tb = slide.shapes.add_textbox(to_x(x + 10), to_y(y + 4), to_w(w - 20), Inches(0.35))
    tf = tb.text_frame
    p = tf.paragraphs[0]
    p.text = title_text
    p.font.size = Pt(size)
    p.font.bold = True
    p.font.color.rgb = RGBColor(0, 0, 0)
    p.font.name = "Arial"

def add_diamond(slide, x, y, w, h, lines, size=9.5):
    shape = slide.shapes.add_shape(MSO_SHAPE.DIAMOND, to_x(x - w/2), to_y(y - h/2), to_w(w), to_h(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(255, 255, 255)
    shape.line.color.rgb = RGBColor(0, 0, 0)
    shape.line.width = Pt(1.25)
    
    tf = shape.text_frame
    tf.word_wrap = True
    tf.vertical_anchor = MSO_ANCHOR.MIDDLE
    tf.margin_left = Inches(0.04)
    tf.margin_right = Inches(0.04)
    
    for idx, line in enumerate(lines):
        if idx == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = line
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(size)
        p.font.bold = True
        p.font.color.rgb = RGBColor(0, 0, 0)
        p.font.name = "Arial"

def add_arrow(slide, x1, y1, x2, y2, label=None, dash=False):
    connector = slide.shapes.add_connector(
        pptx.enum.shapes.MSO_CONNECTOR.STRAIGHT, 
        to_x(x1), to_y(y1), to_x(x2), to_y(y2)
    )
    connector.line.color.rgb = RGBColor(0, 0, 0)
    connector.line.width = Pt(1.25)
    if dash:
        connector.line.dash_style = MSO_LINE_DASH_STYLE.DASH

    if label:
        lx = (x1 + x2) / 2
        ly = (y1 + y2) / 2 - 12
        tb = slide.shapes.add_textbox(to_x(lx - 35), to_y(ly), Inches(0.9), Inches(0.3))
        tf = tb.text_frame
        p = tf.paragraphs[0]
        p.text = label
        p.alignment = PP_ALIGN.CENTER
        p.font.size = Pt(9)
        p.font.bold = True
        p.font.color.rgb = RGBColor(0, 0, 0)
        p.font.name = "Arial"

# ==============================================================================
# SLIDE 1 -- FIG. 1 Overall Multi-Tenant System Architecture (100)
# ==============================================================================
slide1 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide1, 1, 9, "FIG. 1 – Overall multi-tenant system architecture (100).")

add_box(slide1, 660, 105, 280, 55, ["SYSTEM (100)"], weight="bold", size=14)
add_box(slide1, 80, 220, 260, 90, ["CLIENT INTERFACE", "LAYER"], numeral="102")
add_arrow(slide1, 660, 160, 340, 230)

add_groupbox(slide1, 430, 220, 500, 260, "APPLICATION GATEWAY SERVER", numeral="104")
add_box(slide1, 455, 260, 210, 55, ["AUTHENTICATION", "MIDDLEWARE"], numeral="105", numeral_inside=True, size=10)
add_box(slide1, 455, 335, 210, 55, ["TENANT ISOLATION", "MIDDLEWARE"], numeral="106", numeral_inside=True, size=10)
add_box(slide1, 455, 410, 210, 55, ["ROLE-BASED ACCESS", "MIDDLEWARE"], numeral="107", numeral_inside=True, size=10)
add_arrow(slide1, 340, 265, 455, 287)

add_groupbox(slide1, 1000, 220, 520, 260, "MACHINE LEARNING MICROSERVICE", numeral="110")
add_box(slide1, 1030, 255, 220, 55, ["NLP VECTOR", "MATCHER MODULE"], numeral="112", numeral_inside=True, size=10)
add_box(slide1, 1270, 255, 220, 55, ["WEIGHT REDIST.", "ENGINE"], numeral="114", numeral_inside=True, size=10)
add_box(slide1, 1030, 330, 220, 55, ["THRESHOLD", "PENALTY MODULE"], numeral="116", numeral_inside=True, size=10)
add_box(slide1, 1270, 330, 220, 55, ["GENERATIVE AI", "MICROSERVICE I/F"], numeral="118", numeral_inside=True, size=10)
add_arrow(slide1, 940, 300, 1030, 300)

add_box(slide1, 660, 560, 300, 65, ["PERSISTENT DATABASE", "LAYER"], numeral="108")
add_arrow(slide1, 700, 480, 760, 560)
add_arrow(slide1, 1200, 480, 900, 560)

add_box(slide1, 80, 400, 300, 75, ["CRYPTOGRAPHIC E-SIGNATURE", "ENGINE"], numeral="120", numeral_inside=True)
add_box(slide1, 80, 500, 145, 55, ["SHA-256 DIGEST", "GENERATOR"], numeral="122", numeral_inside=True, size=9.5)
add_box(slide1, 235, 500, 145, 55, ["AUDITOR VERIFICATION", "INTERFACE"], numeral="124", numeral_inside=True, size=9.5)
add_arrow(slide1, 430, 350, 340, 420)
add_arrow(slide1, 210, 475, 210, 500)
add_arrow(slide1, 300, 560, 700, 590)

add_box(slide1, 80, 700, 260, 70, ["WELLNESS / STRESS", "TRACKING MODULE"], numeral="126", numeral_inside=True, size=10)
add_box(slide1, 360, 700, 260, 70, ["ANONYMOUS PEER", "SUPPORT WALL MODULE"], numeral="128", numeral_inside=True, size=10)
add_arrow(slide1, 210, 685, 500, 490, dash=True)
add_arrow(slide1, 490, 685, 560, 490, dash=True)

# ==============================================================================
# SLIDE 2 -- FIG. 2 NLP Vector Matcher & Dynamic Parameter Weighting (112, 114)
# ==============================================================================
slide2 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide2, 2, 9, "FIG. 2 – NLP vector matcher and dynamic parameter weighting sub-system (112, 114).")

add_groupbox(slide2, 80, 110, 700, 400, "NLP VECTOR MATCHER MODULE", numeral="112")
add_box(slide2, 120, 155, 260, 60, ["JOB TEXT T_job /", "CANDIDATE TEXT T_cand"])
add_box(slide2, 120, 250, 260, 60, ["EMBEDDING FUNCTION", "E(T)  (d = 384)"])
add_box(slide2, 120, 345, 260, 60, ["COSINE SIMILARITY", "COMPUTATION"])
add_box(slide2, 120, 440, 260, 55, ["Score_similarity"], weight="bold")
add_arrow(slide2, 250, 215, 250, 250)
add_arrow(slide2, 250, 310, 250, 345)
add_arrow(slide2, 250, 405, 250, 440)

add_box(slide2, 460, 250, 280, 60, ["EXCEPTION: MODEL", "UNAVAILABLE / OFFLINE"], dash=True)
add_box(slide2, 460, 345, 280, 60, ["TF-IDF FALLBACK", "VECTORIZER"])
add_box(slide2, 460, 440, 280, 55, ["Score_TFIDF"], weight="bold")
add_arrow(slide2, 380, 280, 460, 280, label="on exception")
add_arrow(slide2, 600, 310, 600, 345)
add_arrow(slide2, 600, 405, 600, 440)

add_groupbox(slide2, 880, 110, 640, 400, "PARAMETER WEIGHT REDISTRIBUTION ENGINE", numeral="114")
add_box(slide2, 920, 155, 260, 60, ["DETECT OMITTED", "CANDIDATE ATTRIBUTE"])
add_box(slide2, 920, 250, 260, 60, ["EXCLUDE WEIGHT FROM", "ACTIVE WEIGHT SET"])
add_box(slide2, 920, 345, 260, 60, ["COMPUTE \u03a9_norm =", "\u03a3 ACTIVE WEIGHTS"])
add_box(slide2, 920, 440, 260, 55, ["RENORMALISE: w\u2032i = wi / \u03a9_norm"], size=10)
add_arrow(slide2, 1050, 215, 1050, 250)
add_arrow(slide2, 1050, 310, 1050, 345)
add_arrow(slide2, 1050, 405, 1050, 440)

add_box(slide2, 1220, 300, 260, 90, ["COMPOSITE MATCH", "SCORE OUTPUT", "(0.0 \u2013 100.0)"], weight="bold")
add_arrow(slide2, 1180, 460, 1250, 390)
add_box(slide2, 300, 570, 1000, 70, ["NOTE: THE SIMILARITY SUB-SCORE OUTPUT BY MODULE (112)", "(Score_similarity OR Score_TFIDF) IS SUPPLIED AS AN INPUT Si TO ENGINE (114)"], size=10, dash=True)

# ==============================================================================
# SLIDE 3 -- FIG. 3 Candidate Scoring & Weight Redistribution Algorithmic Flow
# ==============================================================================
slide3 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide3, 3, 9, "FIG. 3 – Candidate scoring and weight redistribution algorithmic flow.")

add_box(slide3, 650, 100, 300, 60, ["RECEIVE JOB SPEC &", "CANDIDATE PROFILES (104)"])
add_box(slide3, 650, 200, 300, 60, ["COMPUTE SEMANTIC", "SIMILARITY SCORE (112)"])
add_diamond(slide3, 800, 340, 300, 110, ["CANDIDATE PROFILE", "CONTAINS ACADEMIC", "SCORE VALUE ?"])
add_box(slide3, 280, 460, 320, 80, ["APPLY RECRUITER WEIGHTS;", "APPLY THRESHOLD PENALTY", "IF g < g_min (116)"])
add_box(slide3, 950, 460, 340, 80, ["RENORMALISE ACTIVE", "WEIGHTS w\u2032i = wi / \u03a9_norm (114)"])
add_box(slide3, 650, 600, 300, 60, ["COMPUTE COMPOSITE", "MATCH SCORE"])
add_box(slide3, 650, 700, 300, 60, ["SORT & OUTPUT CANDIDATE", "RANKINGS TO UI (102)"])

add_arrow(slide3, 800, 160, 800, 200)
add_arrow(slide3, 800, 260, 800, 285)
add_arrow(slide3, 650, 340, 440, 460, label="YES")
add_arrow(slide3, 950, 340, 1120, 460, label="NO")
add_arrow(slide3, 440, 540, 650, 600)
add_arrow(slide3, 1120, 540, 950, 600)
add_arrow(slide3, 800, 660, 800, 700)

# ==============================================================================
# SLIDE 4 -- FIG. 4 Dual-Pipeline Generative AI Workflow (118)
# ==============================================================================
slide4 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide4, 4, 9, "FIG. 4 – Dual-pipeline generative AI workflow (118).")

add_box(slide4, 660, 100, 280, 60, ["GENERATIVE AI MICROSERVICE", "INTERFACE (118)"], weight="bold")

add_groupbox(slide4, 60, 220, 460, 300, "PIPELINE A \u2013 PREP MATERIAL", size=11)
add_box(slide4, 90, 260, 400, 55, ["JOB DRIVE PUBLICATION EVENT"])
add_box(slide4, 90, 335, 400, 55, ["PROMPT CONSTRUCTION + LLM", "INFERENCE CALL"])
add_box(slide4, 90, 410, 400, 55, ["OUTPUT: TOPICS, QUESTIONS,", "MILESTONES, APTITUDE AREAS"])
add_arrow(slide4, 290, 315, 290, 335)
add_arrow(slide4, 290, 390, 290, 410)

add_groupbox(slide4, 570, 220, 460, 300, "PIPELINE B \u2013 CAREER REMEDIATION", size=11)
add_box(slide4, 600, 260, 400, 55, ["CANDIDATE UNPLACED AFTER", "RECRUITMENT CYCLE"])
add_box(slide4, 600, 335, 400, 55, ["DOMAIN SKILLS + DEPT.", "PATHWAY \u2192 LLM INFERENCE"])
add_box(slide4, 600, 410, 400, 55, ["OUTPUT: UPSKILLING & CAREER", "TRAJECTORY RECOMMENDATIONS"])
add_arrow(slide4, 800, 315, 800, 335)
add_arrow(slide4, 800, 390, 800, 410)

add_groupbox(slide4, 1080, 220, 460, 300, "PIPELINE C \u2013 CHAT MODERATION", size=11)
add_box(slide4, 1110, 260, 400, 55, ["CANDIDATE CHAT MESSAGE", "RECEIVED"])
add_box(slide4, 1110, 335, 400, 55, ["MODERATION PROMPT \u2192", "LLM INFERENCE CALL"])
add_box(slide4, 1110, 410, 400, 55, ["OUTPUT: SAFE / WARNING /", "CRITICAL + REASONING"])
add_arrow(slide4, 1310, 315, 1310, 335)
add_arrow(slide4, 1310, 390, 1310, 410)

add_arrow(slide4, 750, 160, 290, 260)
add_arrow(slide4, 800, 160, 800, 260)
add_arrow(slide4, 850, 160, 1310, 260)

# ==============================================================================
# SLIDE 5 -- FIG. 5 Chat Toxicity Moderation & Wellness Support Loop (126, 128)
# ==============================================================================
slide5 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide5, 5, 9, "FIG. 5 – Chat toxicity moderation and wellness support loop (126, 128).")

add_box(slide5, 120, 130, 320, 60, ["STUDENT CHAT / PEER-WALL", "POST SUBMISSION"])
add_box(slide5, 120, 240, 320, 60, ["API GATEWAY INGESTION (104)"])
add_box(slide5, 120, 350, 320, 60, ["AI MODERATION FILTER", "(PIPELINE C, 118)"])
add_diamond(slide5, 280, 480, 300, 110, ["MESSAGE", "FLAGGED ?"])
add_box(slide5, 120, 600, 300, 55, ["BLOCK / ESCALATE TO", "MODERATOR"])
add_box(slide5, 460, 600, 300, 55, ["PUBLISH TO ANONYMOUS", "PEER SUPPORT WALL (128)"])
add_arrow(slide5, 280, 190, 280, 240)
add_arrow(slide5, 280, 300, 280, 350)
add_arrow(slide5, 280, 410, 280, 425)
add_arrow(slide5, 220, 545, 270, 600, label="YES")
add_arrow(slide5, 340, 545, 560, 600, label="NO")

add_box(slide5, 880, 130, 320, 60, ["CANDIDATE STRESS", "ENTRY SUBMISSION"])
add_box(slide5, 880, 240, 320, 60, ["WELLNESS / STRESS", "TRACKING MODULE (126)"])
add_box(slide5, 880, 350, 320, 60, ["STORED STRESS LEVEL,", "TRIGGER CATEGORY & NOTE"])
add_arrow(slide5, 1040, 190, 1040, 240)
add_arrow(slide5, 1040, 300, 1040, 350)

# ==============================================================================
# SLIDE 6 -- FIG. 6 Multi-Tenant Data Governance & Audit Loop
# ==============================================================================
slide6 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide6, 6, 9, "FIG. 6 – Multi-tenant data governance and feedback/audit loop.")

add_box(slide6, 80, 140, 260, 60, ["CLIENT INTERFACE", "LAYER (102)"])
add_groupbox(slide6, 420, 110, 560, 240, "APPLICATION GATEWAY SERVER (104)")
add_box(slide6, 450, 150, 160, 55, ["AUTH.", "MW (105)"], size=9.5)
add_box(slide6, 630, 150, 160, 55, ["TENANT ISOLATION", "MW (106)"], size=9.5)
add_box(slide6, 810, 150, 140, 55, ["ROLE-BASED", "MW (107)"], size=9.5)
add_arrow(slide6, 340, 170, 450, 177)
add_arrow(slide6, 610, 177, 630, 177)
add_arrow(slide6, 790, 177, 810, 177)

add_box(slide6, 1080, 140, 320, 60, ["TENANT-SCOPED DATABASE", "COLLECTIONS (108)"])
add_arrow(slide6, 950, 177, 1080, 170)

add_box(slide6, 420, 420, 320, 60, ["IMMUTABLE AUDIT LOG", "(APPEND-ONLY)"])
add_arrow(slide6, 1200, 200, 580, 420)

add_box(slide6, 880, 420, 320, 70, ["EXTERNAL COMPLIANCE", "AUDITOR (124)"])
add_arrow(slide6, 880, 450, 740, 450, label="INDEPENDENT VERIFY")

# ==============================================================================
# SLIDE 7 -- FIG. 7 Multi-Layer Database & Cache Architecture (108)
# ==============================================================================
slide7 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide7, 7, 9, "FIG. 7 – Multi-layer database and cache architecture (108).")

add_groupbox(slide7, 120, 130, 620, 480, "PERSISTENT DATABASE LAYER", numeral="108")
add_box(slide7, 160, 175, 260, 55, ["TENANT / INSTITUTION", "RECORDS"], size=9.5)
add_box(slide7, 460, 175, 260, 55, ["CANDIDATE PROFILE", "RECORDS"], size=9.5)
add_box(slide7, 160, 260, 260, 55, ["JOB POSTING", "RECORDS"], size=9.5)
add_box(slide7, 460, 260, 260, 55, ["CONSENT / UNDERTAKING", "RECORDS"], size=9.5)
add_box(slide7, 160, 345, 260, 55, ["IMMUTABLE AUDIT", "LOG RECORDS"], size=9.5)
add_box(slide7, 460, 345, 260, 55, ["COMPOUND TENANT + RECORD", "ID INDEX"], size=9.5)
add_box(slide7, 200, 460, 460, 60, ["QUERY SCOPING: {tenantId, recordId}", "ENFORCED ON EVERY READ / WRITE"], size=9.5)

add_groupbox(slide7, 840, 130, 500, 260, "ML MICROSERVICE LOCAL CACHE", numeral="110")
add_box(slide7, 880, 190, 420, 60, ["FREQUENTLY-ACCESSED JOB", "POSTING EMBEDDING CACHE"], size=9.5)
add_box(slide7, 880, 280, 420, 60, ["REDUCES REPEATED EMBEDDING", "COMPUTATION LOAD"], size=9.5)
add_arrow(slide7, 880, 260, 880, 280)
add_arrow(slide7, 740, 260, 880, 220)

# ==============================================================================
# SLIDE 8 -- FIG. 8 Security & Defense-in-Depth Architecture (105, 106, 107)
# ==============================================================================
slide8 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide8, 8, 9, "FIG. 8 – Security and defence-in-depth architecture (105, 106, 107).")

add_box(slide8, 80, 130, 260, 60, ["CLIENT HTTPS", "REQUEST (102)"])
add_box(slide8, 420, 130, 260, 60, ["AUTHENTICATION", "MIDDLEWARE (105)"])
add_box(slide8, 760, 130, 260, 60, ["TENANT ISOLATION", "MIDDLEWARE (106)"])
add_box(slide8, 1100, 130, 260, 60, ["ROLE-BASED ACCESS", "MIDDLEWARE (107)"])
add_box(slide8, 1100, 260, 260, 60, ["PROTECTED ROUTE", "HANDLER"])

add_arrow(slide8, 340, 160, 420, 160)
add_arrow(slide8, 680, 160, 760, 160)
add_arrow(slide8, 1020, 160, 1100, 160)
add_arrow(slide8, 1230, 190, 1230, 260)

add_box(slide8, 420, 320, 260, 55, ["401 UNAUTHORISED"], dash=True, size=10)
add_box(slide8, 760, 320, 260, 55, ["403 CROSS-TENANT", "FORBIDDEN"], dash=True, size=10)
add_box(slide8, 1100, 400, 260, 55, ["403 ROLE", "FORBIDDEN"], dash=True, size=10)
add_arrow(slide8, 500, 190, 500, 320, label="fail", dash=True)
add_arrow(slide8, 840, 190, 840, 320, label="fail", dash=True)
add_arrow(slide8, 1170, 190, 1170, 400, label="fail", dash=True)

# ==============================================================================
# SLIDE 9 -- FIG. 9 Cryptographic E-Signature & Institutional Consent (120,122,124)
# ==============================================================================
slide9 = prs.slides.add_slide(blank_slide_layout)
add_form2_header_footer(slide9, 9, 9, "FIG. 9 – Cryptographic e-signature and institutional consent sub-system (120, 122, 124).")

add_groupbox(slide9, 80, 110, 620, 200, "E-SIGNATURE ENGINE", numeral="120")
add_box(slide9, 110, 150, 260, 55, ["MULTI-AUTHORITY ISSUANCE", "ROUTING"], size=9.5)
add_box(slide9, 410, 150, 260, 55, ["10 UNDERTAKING SUBJECT", "CATEGORIES"], size=9.5)
add_box(slide9, 260, 230, 260, 55, ["PLACEMENT OFFICER /", "DEPT. HOD AUTHORITY"], size=9.5)
add_arrow(slide9, 240, 205, 350, 230)
add_arrow(slide9, 540, 205, 430, 230)

add_box(slide9, 80, 350, 260, 60, ["STUDENT DIGITAL", "SIGNATURE \u03c3_student"])
add_box(slide9, 400, 350, 260, 60, ["PARENT CO-SIGNATURE", "\u03c3_parent (IF REQUIRED)"], dash=True)
add_arrow(slide9, 390, 290, 210, 350)
add_arrow(slide9, 390, 290, 530, 350)

add_box(slide9, 760, 400, 340, 80, ["SHA-256 DIGEST GENERATOR", "H_\u03c3 = SHA256(id+sig+ts)"], numeral="122", numeral_inside=True)
add_arrow(slide9, 340, 380, 760, 430)
add_arrow(slide9, 530, 380, 760, 440)

add_box(slide9, 760, 540, 340, 60, ["EXPIRATION STATE MACHINE", "PENDING \u2192 EXPIRED_OVERDUE"])
add_arrow(slide9, 930, 480, 930, 540)

add_box(slide9, 1180, 400, 320, 80, ["IMMUTABLE AUDIT LOG /", "TAMPER-EVIDENT RECORD"])
add_arrow(slide9, 1100, 440, 1180, 440)

add_box(slide9, 1180, 540, 320, 70, ["AUDITOR VERIFICATION", "INTERFACE (124)"])
add_arrow(slide9, 1340, 480, 1340, 540)

# Save output presentation
output_path = r"o:\OfferDesk\OfferDesk_Patent_Form2_Editable_Drawings.pptx"
prs.save(output_path)
print(f"Successfully generated Patent Form 2 compliant editable PowerPoint file at: {output_path}")
