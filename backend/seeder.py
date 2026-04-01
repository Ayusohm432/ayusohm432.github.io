from sqlalchemy.orm import Session
import models
import json

def seed_cms_data(db: Session):
    # Header
    if db.query(models.Header).count() == 0:
        db.add(models.Header(
            name="Ayush Kumar",
            title="Full-Stack Developer",
            tagline="I'm a Computer Science & Engineering student at GCE, passionate about creating interactive, modern, and scalable web applications.",
            github_link="https://github.com/Ayusohm432",
            linkedin_link="https://linkedin.com/in/ayusohm432"
        ))

    # About
    if db.query(models.About).count() == 0:
        highlights_data = [
            "B.Tech CSE @ Gaya College of Engineering · CGPA 8.55",
            "Full-Stack Intern @ Bytical.ai · FastAPI, React, MongoDB",
            "Solved 1000+ problems on competitive coding platforms",
            "Participated in ICPC 2024 & 2025 · National Hackathons",
            "Microsoft Certified: Azure AI Engineer Associate"
        ]
        db.add(models.About(
            bio="My journey spans Full-Stack Web Development (React, FastAPI, PHP), Android Development, and AI/ML exposure through data annotation and research. I blend strong system-level thinking with beautiful, user-first interfaces.",
            institution="Gaya College of Engineering",
            highlights=json.dumps(highlights_data)
        ))

    # Resume
    if db.query(models.Resume).count() == 0:
        db.add(models.Resume(
            drive_link="/AYUSH KUMAR.pdf"
        ))

    # Skills
    if db.query(models.Skill).count() == 0:
        skills = [
            ("Languages", "JavaScript", 90),
            ("Languages", "Python", 85),
            ("Languages", "Java", 82),
            ("Languages", "C / C++", 78),
            ("Languages", "HTML / CSS", 95),
            ("Languages", "Go", 55),
            ("Frameworks & Libs", "React.js", 88),
            ("Frameworks & Libs", "FastAPI", 82),
            ("Frameworks & Libs", "Tailwind CSS", 90),
            ("Frameworks & Libs", "Node.js / Express", 70),
            ("Frameworks & Libs", "Flask", 72),
            ("Frameworks & Libs", "PHP", 76),
            ("Tools & DBs", "Git & GitHub", 88),
            ("Tools & DBs", "MySQL / MongoDB", 82),
            ("Tools & DBs", "Linux", 78),
            ("Tools & DBs", "Firebase", 68),
            ("Tools & DBs", "Docker", 55),
            ("Tools & DBs", "Google Cloud", 60),
        ]
        for c, n, l in skills:
            db.add(models.Skill(category=c, name=n, level=l))

    # Experience
    if db.query(models.Experience).count() == 0:
        exps = [
            ("Full-Stack Developer Intern", "Bytical.ai", "May 2025 – Present", "Implemented JWT authentication & autosave. Built scalable APIs using FastAPI, React, and MongoDB. Improved UX and backend performance for production systems."),
            ("AI Data Annotator (Part-time)", "Outlier · Remote", "2024", "Labeled datasets for Computer Vision & NLP models. Improved ML training accuracy and maintained data consistency standards."),
            ("Android Developer Intern", "Gowox Infotech Pvt. Ltd.", "Apr 2022 – May 2022", "Developed Android applications using Java & XML. Integrated Firebase Authentication and Realtime Database."),
            ("Web Developer Intern", "Gowox Infotech Pvt. Ltd.", "Dec 2022 – Jan 2023", "Built responsive web pages using HTML, CSS, JavaScript, PHP with MySQL backend integration."),
            ("Technical Blogger", "Hashnode & WordPress", "2023 – Present", "Authoring technical articles on web development, Android, AI, and software engineering for the developer community.")
        ]
        for r, c, dp, desc in exps:
            db.add(models.Experience(role=r, company=c, date_period=dp, description=desc))

    # Education
    if db.query(models.Education).count() == 0:
        edus = [
            ("B.Tech in Computer Science & Engineering", "Gaya College of Engineering · Bihar Engineering University", "2023 – 2026", "Pursuing with a CGPA of 8.55 / 10. Focus on advanced algorithms, full-stack development, and practical software engineering."),
            ("Diploma in Computer Science & Engineering", "Government Polytechnic, Muzaffarpur · SBTE", "2020 – 2023", "Graduated with a CGPA of 8.58 / 10. Foundation in programming, networking, and core CS principles.")
        ]
        for deg, inst, dp, desc in edus:
            db.add(models.Education(degree=deg, institution=inst, date_period=dp, description=desc))

    # Achievements
    if db.query(models.Achievement).count() == 0:
        achs = [
            ("🏆", "Solved 1000+ coding problems on LeetCode, GeeksForGeeks, and other platforms"),
            ("🎯", "Participated in ICPC Contest in 2024 and 2025"),
            ("🚀", "Participated in State and National level hackathons"),
            ("☁️", "Microsoft Certified: Azure AI Engineer Associate"),
            ("📜", "NPTEL Certifications: C Programming, Java, Machine Learning"),
            ("🌐", "Cisco Certified: Networking Essentials & C++ Programming Essentials"),
            ("🤖", "Edunet Foundation: Foundations of AI"),
            ("💻", "Infochord Technologies: Web Development Certification"),
        ]
        for ic, txt in achs:
            db.add(models.Achievement(icon=ic, text=txt))

    db.commit()
