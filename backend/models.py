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

class Header(Base):
    __tablename__ = "header"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    title = Column(String)
    tagline = Column(Text)
    email = Column(String)
    profile_image = Column(String)
    github_link = Column(String)
    linkedin_link = Column(String)

class About(Base):
    __tablename__ = "about"
    id = Column(Integer, primary_key=True, index=True)
    bio = Column(Text)
    institution = Column(String)
    highlights = Column(Text) # JSON string of highlights

class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String)
    name = Column(String)
    level = Column(Integer)

class Experience(Base):
    __tablename__ = "experience"
    id = Column(Integer, primary_key=True, index=True)
    role = Column(String)
    company = Column(String)
    date_period = Column(String)
    description = Column(Text)

class Education(Base):
    __tablename__ = "education"
    id = Column(Integer, primary_key=True, index=True)
    degree = Column(String)
    institution = Column(String)
    date_period = Column(String)
    description = Column(Text)

class Achievement(Base):
    __tablename__ = "achievements"
    id = Column(Integer, primary_key=True, index=True)
    icon = Column(String)
    text = Column(String)

class Resume(Base):
    __tablename__ = "resume"
    id = Column(Integer, primary_key=True, index=True)
    drive_link = Column(Text)

class SocialLink(Base):
    __tablename__ = "social_links"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    icon_name = Column(String)
    url = Column(String)
    color_class = Column(String)
