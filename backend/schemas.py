from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ProjectBase(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_link: Optional[str] = None
    live_demo: Optional[str] = None
    report_link: Optional[str] = None

class CommonIssueBase(BaseModel):
    report_type: str
    name: Optional[str] = None
    email: Optional[str] = None
    page_feature: str
    issue: str
    steps: Optional[str] = None
    screenshots: Optional[str] = None

class CommonIssueCreate(CommonIssueBase):
    pass

class CommonIssue(CommonIssueBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

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

class FeatureRequestBase(BaseModel):
    project_name: str
    name: Optional[str] = None
    email: Optional[str] = None
    title: str
    description: str

class FeatureRequestCreate(FeatureRequestBase):
    pass

class FeatureRequest(FeatureRequestBase):
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

# --- CMS SCHEMAS ---

class HeaderBase(BaseModel):
    name: str
    title: str
    tagline: str
    github_link: Optional[str] = None
    linkedin_link: Optional[str] = None

class Header(HeaderBase):
    id: int
    class Config:
        from_attributes = True

class AboutBase(BaseModel):
    bio: str
    institution: str
    highlights: str

class About(AboutBase):
    id: int
    class Config:
        from_attributes = True

class SkillBase(BaseModel):
    category: str
    name: str
    level: int

class Skill(SkillBase):
    id: int
    class Config:
        from_attributes = True

class ExperienceBase(BaseModel):
    role: str
    company: str
    date_period: str
    description: str

class Experience(ExperienceBase):
    id: int
    class Config:
        from_attributes = True

class EducationBase(BaseModel):
    degree: str
    institution: str
    date_period: str
    description: str

class Education(EducationBase):
    id: int
    class Config:
        from_attributes = True

class AchievementBase(BaseModel):
    icon: str
    text: str

class Achievement(AchievementBase):
    id: int
    class Config:
        from_attributes = True

class ResumeBase(BaseModel):
    drive_link: str

class Resume(ResumeBase):
    id: int
    class Config:
        from_attributes = True
