from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import models, schemas
from database import engine, get_db, SessionLocal
from typing import List
from dotenv import load_dotenv
import seeder

load_dotenv()

# Create DB tables
models.Base.metadata.create_all(bind=engine)

db_init = SessionLocal()
try:
    seeder.seed_cms_data(db_init)
finally:
    db_init.close()

import os
import time
import threading
import requests
import logging
import re

def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def keep_alive():
    url = os.environ.get("RENDER_EXTERNAL_URL")
    if not url:
        logger.info("KeepAlive: no URL found, skipping")
        return
    logger.info(f"KeepAlive: pinging {url} every 5 minutes...")
    while True:
        try:
            requests.get(url, timeout=10)
            logger.info("KeepAlive: ping sent ✓")
        except Exception as e:
            logger.error(f"KeepAlive: something went wrong — {e}")
        time.sleep(300) # sleep for 5 minutes, then repeat

# Start the keep-alive in a background thread
thread = threading.Thread(target=keep_alive, daemon=True)
thread.start()

app = FastAPI(title="Portfolio API")

# Security: Restrict CORS to specific production and local origins
origins = [
    "https://ayusohm432.github.io",
    "http://localhost:5173", # Vite default
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True, # Allowed now that we have specific origins
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Portfolio API"}

class LoginRequest(BaseModel):
    password: str

def verify_admin(x_admin_token: str = Header(None)):
    expected = os.environ.get("ADMIN_PASSWORD")
    
    # Security: Ensure a password is set in production
    if not expected:
        if os.environ.get("RENDER"): # Check if we are on Render production
            raise HTTPException(status_code=500, detail="ADMIN_PASSWORD environment variable is missing on server")
        expected = "admin123" # Local dev fallback
        
    if x_admin_token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized admin access")
    return x_admin_token

@app.post("/admin/login")
def login_admin(req: LoginRequest):
    expected = os.environ.get("ADMIN_PASSWORD")
    
    # Production safety check
    if not expected:
        if os.environ.get("RENDER"):
            raise HTTPException(status_code=500, detail="Security Error: Admin Password not configured")
        expected = "admin123"
        
    if req.password == expected:
        return {"token": req.password}
    raise HTTPException(status_code=401, detail="Invalid password")

@app.get("/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.post("/projects", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_project = models.Project(**project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.post("/bug-report", response_model=schemas.BugReport)
def create_bug_report(bug: schemas.BugReportCreate, db: Session = Depends(get_db)):
    db_bug = models.BugReport(**bug.model_dump())
    db.add(db_bug)
    db.commit()
    db.refresh(db_bug)
    return db_bug

@app.get("/bug-reports", response_model=List[schemas.BugReport])
def get_bug_reports(db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    return db.query(models.BugReport).order_by(models.BugReport.created_at.desc()).all()

@app.post("/feature-requests", response_model=schemas.FeatureRequest)
def create_feature_request(req: schemas.FeatureRequestCreate, db: Session = Depends(get_db)):
    db_req = models.FeatureRequest(**req.model_dump())
    db.add(db_req)
    db.commit()
    db.refresh(db_req)
    return db_req

@app.get("/feature-requests", response_model=List[schemas.FeatureRequest])
def get_feature_requests(db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    return db.query(models.FeatureRequest).order_by(models.FeatureRequest.created_at.desc()).all()

@app.post("/common-issues", response_model=schemas.CommonIssue)
def create_common_issue(issue: schemas.CommonIssueCreate, db: Session = Depends(get_db)):
    db_issue = models.CommonIssue(**issue.model_dump())
    db.add(db_issue)
    db.commit()
    db.refresh(db_issue)
    return db_issue

@app.get("/common-issues", response_model=List[schemas.CommonIssue])
def get_common_issues(db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    return db.query(models.CommonIssue).order_by(models.CommonIssue.created_at.desc()).all()

@app.post("/projects/{project_id}/generate-link", response_model=schemas.Project)
def generate_project_link(project_id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    slug = slugify(project.title)
    # Target structure defined by user: ayusohm432.github.io/#/report/[slug]
    project.report_link = f"ayusohm432.github.io/#/report/{slug}"
    db.commit()
    db.refresh(project)
    return project

@app.put("/projects/{project_id}", response_model=schemas.Project)
def update_project(project_id: int, project_update: schemas.ProjectCreate, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_project = db.query(models.Project).filter(models.Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in project_update.model_dump().items():
        setattr(db_project, k, v)
    db.commit()
    db.refresh(db_project)
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db.query(models.Project).filter(models.Project.id == project_id).delete()
    db.commit()
    return {"status": "deleted"}

@app.post("/feedback", response_model=schemas.Feedback)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(**feedback.model_dump())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@app.get("/feedbacks", response_model=List[schemas.Feedback])
def get_feedbacks(db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    return db.query(models.Feedback).order_by(models.Feedback.created_at.desc()).all()

@app.post("/contact", response_model=schemas.ContactMessage)
def create_contact(contact: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    db_contact = models.ContactMessage(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@app.get("/contacts", response_model=List[schemas.ContactMessage])
def get_contacts(db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()

# --- CMS ENDPOINTS ---

@app.get("/header", response_model=schemas.Header)
def get_header(db: Session = Depends(get_db)):
    return db.query(models.Header).first()

@app.put("/header", response_model=schemas.Header)
def update_header(header: schemas.HeaderBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_header = db.query(models.Header).first()
    for k, v in header.model_dump().items():
        setattr(db_header, k, v)
    db.commit()
    db.refresh(db_header)
    return db_header

@app.get("/about", response_model=schemas.About)
def get_about(db: Session = Depends(get_db)):
    return db.query(models.About).first()

@app.put("/about", response_model=schemas.About)
def update_about(about: schemas.AboutBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_about = db.query(models.About).first()
    for k, v in about.model_dump().items():
        setattr(db_about, k, v)
    db.commit()
    db.refresh(db_about)
    return db_about

@app.get("/resume", response_model=schemas.Resume)
def get_resume(db: Session = Depends(get_db)):
    return db.query(models.Resume).first()

@app.put("/resume", response_model=schemas.Resume)
def update_resume(resume: schemas.ResumeBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_resume = db.query(models.Resume).first()
    for k, v in resume.model_dump().items():
        setattr(db_resume, k, v)
    db.commit()
    db.refresh(db_resume)
    return db_resume

# --- SKILLS ---
@app.get("/skills", response_model=List[schemas.Skill])
def get_skills(db: Session = Depends(get_db)):
    return db.query(models.Skill).all()

@app.post("/skills", response_model=schemas.Skill)
def add_skill(skill: schemas.SkillBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_skill = models.Skill(**skill.model_dump())
    db.add(db_skill)
    db.commit()
    db.refresh(db_skill)
    return db_skill

@app.delete("/skills/{id}")
def delete_skill(id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db.query(models.Skill).filter(models.Skill.id == id).delete()
    db.commit()
    return {"status": "deleted"}

# --- EXPERIENCE ---
@app.get("/experiences", response_model=List[schemas.Experience])
def get_experiences(db: Session = Depends(get_db)):
    return db.query(models.Experience).all()

@app.post("/experiences", response_model=schemas.Experience)
def add_experience(exp: schemas.ExperienceBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_exp = models.Experience(**exp.model_dump())
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)
    return db_exp

@app.delete("/experiences/{id}")
def delete_experience(id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db.query(models.Experience).filter(models.Experience.id == id).delete()
    db.commit()
    return {"status": "deleted"}

# --- EDUCATION ---
@app.get("/educations", response_model=List[schemas.Education])
def get_educations(db: Session = Depends(get_db)):
    return db.query(models.Education).all()

@app.post("/educations", response_model=schemas.Education)
def add_education(edu: schemas.EducationBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_edu = models.Education(**edu.model_dump())
    db.add(db_edu)
    db.commit()
    db.refresh(db_edu)
    return db_edu

@app.delete("/educations/{id}")
def delete_education(id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db.query(models.Education).filter(models.Education.id == id).delete()
    db.commit()
    return {"status": "deleted"}

# --- ACHIEVEMENTS ---
@app.get("/achievements", response_model=List[schemas.Achievement])
def get_achievements(db: Session = Depends(get_db)):
    return db.query(models.Achievement).all()

@app.post("/achievements", response_model=schemas.Achievement)
def add_achievement(ach: schemas.AchievementBase, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db_ach = models.Achievement(**ach.model_dump())
    db.add(db_ach)
    db.commit()
    db.refresh(db_ach)
    return db_ach

@app.delete("/achievements/{id}")
def delete_achievement(id: int, db: Session = Depends(get_db), token: str = Depends(verify_admin)):
    db.query(models.Achievement).filter(models.Achievement.id == id).delete()
    db.commit()
    return {"status": "deleted"}
