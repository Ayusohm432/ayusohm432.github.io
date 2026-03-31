from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_link: Optional[str] = None
    live_demo: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    class Config:
        from_attributes = True

class BugReportBase(BaseModel):
    project_name: str
    issue_title: str
    description: str
    severity: str

class BugReportCreate(BugReportBase):
    pass

class BugReport(BugReportBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class FeedbackBase(BaseModel):
    name: Optional[str] = None
    message: str
    rating: int

class FeedbackCreate(FeedbackBase):
    pass

class Feedback(FeedbackBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class ContactMessageBase(BaseModel):
    name: str
    email: str
    message: str

class ContactMessageCreate(ContactMessageBase):
    pass

class ContactMessage(ContactMessageBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True
