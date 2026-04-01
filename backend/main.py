from fastapi import FastAPI, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import models, schemas
from database import engine, get_db
from typing import List
from dotenv import load_dotenv
load_dotenv()

# Create DB tables
models.Base.metadata.create_all(bind=engine)

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Since you'll deploy on Vercel, this handles CORS for now
    allow_credentials=False, # Must be False when allow_origins is ["*"]
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Portfolio API"}

class LoginRequest(BaseModel):
    password: str

def verify_admin(x_admin_token: str = Header(None)):
    expected = os.environ.get("ADMIN_PASSWORD", "admin123")
    if x_admin_token != expected:
        raise HTTPException(status_code=401, detail="Unauthorized admin access")
    return x_admin_token

@app.post("/admin/login")
def login_admin(req: LoginRequest):
    expected = os.environ.get("ADMIN_PASSWORD", "admin123")
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
    # Target structure defined by user: ayusohm432.github.io/report/[slug]
    project.report_link = f"ayusohm432.github.io/report/{slug}"
    db.commit()
    db.refresh(project)
    return project

@app.post("/feedback", response_model=schemas.Feedback)
def create_feedback(feedback: schemas.FeedbackCreate, db: Session = Depends(get_db)):
    db_feedback = models.Feedback(**feedback.model_dump())
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@app.get("/feedbacks", response_model=List[schemas.Feedback])
def get_feedbacks(db: Session = Depends(get_db)):
    return db.query(models.Feedback).order_by(models.Feedback.created_at.desc()).all()

@app.post("/contact", response_model=schemas.ContactMessage)
def create_contact(contact: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    db_contact = models.ContactMessage(**contact.model_dump())
    db.add(db_contact)
    db.commit()
    db.refresh(db_contact)
    return db_contact

@app.get("/contacts", response_model=List[schemas.ContactMessage])
def get_contacts(db: Session = Depends(get_db)):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()
