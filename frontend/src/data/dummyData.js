export const dummyData = {
  header: {
    name: "Ayush Kumar",
    title: "AI & Full-Stack Developer",
    tagline: "Bridging the gap between intelligent systems and seamless user experiences.",
    email: "ayusohm432@gmail.com",
    linkedin_link: "https://linkedin.com/in/ayusohm",
    github_link: "https://github.com/Ayusohm432",
    profile_image: "" // Empty or a default local image path
  },
  about: {
    bio: "I'm a passionate developer focused on creating innovative solutions at the intersection of AI and web technologies. With a background in computer science and a keen interest in intelligent systems, I build scalable applications that solve real-world problems.",
    highlights: JSON.stringify([
      "Building Agentic AI solutions",
      "Full-stack architecture with React & FastAPI",
      "Cybersecurity and Steganography researcher",
      "Interactive data-driven dashboards"
    ])
  },
  skills: [
    // Frontend
    { name: "React.js", level: 90, category: "Frontend" },
    { name: "Tailwind CSS", level: 95, category: "Frontend" },
    { name: "Framer Motion", level: 85, category: "Frontend" },
    { name: "JavaScript/ES6+", level: 92, category: "Frontend" },
    // Backend
    { name: "FastAPI", level: 80, category: "Backend" },
    { name: "Node.js", level: 85, category: "Backend" },
    { name: "Python", level: 88, category: "Backend" },
    { name: "PHP/MySQL", level: 75, category: "Backend" },
    // Tools & Others
    { name: "Git/GitHub", level: 90, category: "Tools" },
    { name: "Docker", level: 70, category: "Tools" },
    { name: "AWS/Render", level: 65, category: "Tools" },
    { name: "Go", level: 60, category: "Tools" }
  ],
  projects: [
    {
      id: 1,
      title: "Feedback Management System",
      description: "A full-stack web application for collecting and managing academic feedback efficiently, featuring interactive dashboards.",
      tech_stack: "PHP, MySQL, JavaScript",
      github_link: "https://github.com/Ayusohm432/Feedback-Management-System",
      live_demo: "https://ayusohm432.github.io/Feedback-Management-System/"
    },
    {
      id: 2,
      title: "AI Skills Gap Analyzer",
      description: "An intelligent career development platform designed to help students understand industry skill requirements and prepare effectively for technical roles.",
      tech_stack: "JavaScript, HTML, CSS",
      github_link: "https://github.com/Ayusohm432/AI-Skills-Gap-Analyzer",
      live_demo: "https://ayusohm432.github.io/AI-Skills-Gap-Analyzer/"
    },
    {
      id: 3,
      title: "AgenticGoKit",
      description: "Open-source Agentic AI framework in Go for building, orchestrating, and deploying intelligent agents. LLM-agnostic and event-driven.",
      tech_stack: "Go, AI Agents",
      github_link: "https://github.com/Ayusohm432/AgenticGoKit",
      live_demo: "#"
    },
    {
      id: 4,
      title: "StegoShield",
      description: "Advanced steganography application for secure message hiding and extraction using modern cryptographic techniques.",
      tech_stack: "Python, Security",
      github_link: "https://github.com/Ayusohm432/StegoShield",
      live_demo: "#"
    },
    {
      id: 5,
      title: "Next-Gen Portfolio",
      description: "A modern, interactive frontend with a scalable FastAPI backend supporting real-time bug reporting and feedback.",
      tech_stack: "React, FastAPI, Tailwind CSS, Framer Motion",
      github_link: "https://github.com/Ayusohm432/ayusohm432.github.io",
      live_demo: "https://ayusohm432.github.io"
    },
    {
      id: 6,
      title: "MediSync — Healthcare Management System",
      description: "A real-time healthcare resource and inventory management system with secure PHP-MySQL backend and responsive UI.",
      tech_stack: "HTML, CSS, JavaScript, PHP, MySQL",
      github_link: "https://github.com/Ayusohm432",
      live_demo: "#"
    }
  ],
  experiences: [
    {
      role: "AI & Full-Stack Developer",
      company: "The Creative Workspace",
      date_period: "2023 - Present",
      description: "Developing intelligent agentic frameworks and high-performance web applications using modern tech stacks."
    },
    {
      role: "Security Researcher",
      company: "Academic Project",
      date_period: "2022 - 2023",
      description: "Developed StegoShield, a steganography tool for secure data hiding in images."
    }
  ],
  educations: [
    {
      degree: "Computer Science & Engineering",
      institution: "The Technological University",
      date_period: "2021 - 2025",
      description: "Focusing on AI, Full-Stack development, and System Architecture."
    }
  ],
  achievements: [
    { icon: "🏆", text: "Won Best Innovation Award for Feedback Management System." },
    { icon: "📜", text: "Certified Full-Stack Developer — Advanced Web Architectures." },
    { icon: "🤖", text: "Top contributor to open-source Agentic AI frameworks." },
    { icon: "💼", text: "Successfully deployed 10+ production-grade applications." }
  ],
  resume: {
    drive_link: "/AYUSH KUMAR.pdf" // Local fallback
  }
};
