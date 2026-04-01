from sqlalchemy import Column, Integer, String, Text, DateTime
from database import Base
import datetime

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    tech_stack = Column(String) 
    github_link = Column(String)
    live_demo = Column(String)
    report_link = Column(String)

class CommonIssue(Base):
    __tablename__ = "common_issues"

    id = Column(Integer, primary_key=True, index=True)
    report_type = Column(String)
    name = Column(String)
    email = Column(String)
    page_feature = Column(String)
    issue = Column(Text)
    steps = Column(Text)
    screenshots = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class BugReport(Base):
    __tablename__ = "bug_reports"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    issue_title = Column(String)
    description = Column(Text)
    severity = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class FeatureRequest(Base):
    __tablename__ = "feature_requests"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, index=True)
    name = Column(String)
    email = Column(String)
    title = Column(String)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    message = Column(Text)
    rating = Column(Integer)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
