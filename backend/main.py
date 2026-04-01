from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
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

@app.get("/projects", response_model=List[schemas.Project])
def get_projects(db: Session = Depends(get_db)):
    return db.query(models.Project).all()

@app.post("/bug-report", response_model=schemas.BugReport)
def create_bug_report(bug: schemas.BugReportCreate, db: Session = Depends(get_db)):
    db_bug = models.BugReport(**bug.model_dump())
    db.add(db_bug)
    db.commit()
    db.refresh(db_bug)
    return db_bug

@app.get("/bug-reports", response_model=List[schemas.BugReport])
def get_bug_reports(db: Session = Depends(get_db)):
    return db.query(models.BugReport).order_by(models.BugReport.created_at.desc()).all()

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
