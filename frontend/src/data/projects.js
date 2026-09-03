export const projectsData = [
  {
    id: "agriculture-marketplace",
    name: "Smart Agriculture Marketplace",
    category: "E-Commerce / Full Stack Java",
    featured: true,
    tag: "Flagship Java Project",
    shortDescription: "E-commerce platform connecting farmers directly with consumers for transparent agricultural product sales.",
    problemSolved: "Eliminates intermediaries and unfair distributor markups by enabling farmers to list harvested produce directly at fair market prices, with real-time transparent buyer checkout.",
    keyFeatures: [
      "Direct farmer product listing and batch inventory management",
      "Dynamic catalog search, category filtering, and harvest origin tags",
      "Secure cart and order placement workflows with status tracking",
      "Role-based access separating farmer portals from consumer views"
    ],
    technologies: ["React", "Java", "Spring Boot", "MySQL", "CSS", "REST APIs"],
    myContribution: "Engineered full-stack features including backend REST services using Spring Boot & Java, relational database modeling in MySQL, and an interactive React interface during internship training at AURA Institute.",
    developmentApproach: "Adopted MVC architecture with decoupled frontend and backend layers, utilizing JPA/Hibernate for database operations and modular React components for stateful shopping cart workflows.",
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    type: "agriculture"
  },
  {
    id: "aluminium-recovery",
    name: "Smart Aluminium Recovery System",
    category: "Workflow Management / MERN",
    featured: true,
    tag: "Production Workflow",
    shortDescription: "Digital workflow platform for aluminium recovery and sustainable industrial refinement with real-time batch tracking.",
    problemSolved: "Replaces error-prone manual paper logs in scrap recovery plants with an end-to-end digital audit trail, calculating purity grading and recovery yields automatically.",
    keyFeatures: [
      "Material intake logging and scrap sorting categorization",
      "Automated purity gauge calculation (98.4% target benchmark)",
      "Daily yield metric analytics with CO2 emission reduction indicators",
      "Sequential multi-stage processing pipeline: Sorting → Smelt → Ingot"
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB", "CSS"],
    myContribution: "Designed the full-stack MERN architecture, implemented RESTful endpoints for batch intake management, and created responsive dashboard interfaces with real-time analytics.",
    developmentApproach: "Utilized asynchronous Express routes, MongoDB document indexing for batch logs, and reusable React UI modules for data visualization.",
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    type: "aluminium"
  },
  {
    id: "projecthub-platform",
    name: "ProjectHub — University Project Platform",
    category: "Project Management / Full Stack",
    featured: false,
    tag: "Academic Workflow",
    shortDescription: "Multi-role platform designed to streamline final-year university project workflows, evaluations, and guide reviews.",
    problemSolved: "Centralizes university project approval bottlenecks between students, faculty guides, and department heads into a unified digital evaluation milestone system.",
    keyFeatures: [
      "Multi-tier role-based authentication (Student, Faculty Guide, HOD)",
      "Phased milestone tracker (SRS, Prototype Review, Final Viva)",
      "Faculty feedback and endorsement sign-off system",
      "Automated progress status reports and viva scheduling"
    ],
    technologies: ["React", "Django", "MySQL", "CSS"],
    myContribution: "Developed the frontend client with React and connected it with Django backend services, structuring MySQL tables for multi-role submissions and guide reviews.",
    developmentApproach: "Built role-based route guards in React, with Django REST endpoints enforcing permissions across student and faculty tiers.",
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    type: "projecthub"
  },
  {
    id: "medicare-system",
    name: "Medicare — Pharmacy Management System",
    category: "Pharmacy Management / Healthcare",
    featured: false,
    tag: "Healthcare Inventory",
    shortDescription: "Web application designed to digitize pharmacy inventory, batch expiration alerts, and prescription management.",
    problemSolved: "Prevents dispensing expired medicines and stock shortages by tracking batch-level expiration timelines and streamlining prescription dispensing queues.",
    keyFeatures: [
      "Automated batch expiry warning engine highlighting near-expiry stock",
      "Digital prescription intake queue and dispensing workflow",
      "Real-time unit inventory tracking with restock threshold indicators",
      "Searchable medicine directory with dosage and manufacturer metadata"
    ],
    technologies: ["React", "Django", "MySQL", "CSS"],
    myContribution: "Created inventory tracking modules, built expiration alert calculations, and developed the prescription queue interface using React and Django.",
    developmentApproach: "Normalized MySQL inventory tables for batch numbers and expiry dates, with frontend filters highlighting urgent restock items.",
    githubUrl: "https://github.com",
    liveDemoUrl: "",
    type: "medicare"
  },
];
