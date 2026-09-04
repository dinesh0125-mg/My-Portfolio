import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding production portfolio database...');

  // 1. Seed Real Admin Account
  const adminName = process.env.ADMIN_NAME || 'Dinesh M';
  const adminEmail = process.env.ADMIN_EMAIL || 'nandhu0259@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Dnsh@1980';

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash,
      isActive: true,
    },
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: 'ADMIN',
      isActive: true,
    },
  });
  console.log(`✅ Admin account configured: ${admin.email}`);

  // 2. Seed Hero Section
  await prisma.hero.deleteMany();
  await prisma.hero.create({
    data: {
      name: 'Dinesh M',
      title: 'Full Stack Developer',
      subtitle: 'Building responsive, scalable, and user-centric web applications.',
      description:
        'Final-year Computer Science & Engineering student specializing in Java, Spring Boot, React, Node.js, and MySQL. Seeking a Full Stack / Java Developer role to engineer high-impact solutions.',
      badge: 'Open to Full Stack & Java Developer Roles • Chennai, India',
      primaryButtonText: 'View My Projects',
      primaryButtonLink: '#projects',
      secondaryButtonText: 'Download Resume',
      secondaryButtonLink: '/Dinesh_M_Resume.pdf',
      resumeUrl: '/Dinesh_M_Resume.pdf',
      profileImageUrl: '/images/hero-developer.jpg',
      location: 'Chennai, India',
    },
  });
  console.log('✅ Hero section seeded');

  // 3. Seed About Section & Highlights
  await prisma.aboutHighlight.deleteMany();
  await prisma.about.deleteMany();

  const about = await prisma.about.create({
    data: {
      heading: 'Engineering Scalable & Practical Web Solutions',
      description:
        'Computer Science and Engineering undergraduate at J.N.N Institute of Engineering (CGPA: 7.41 / 10.0), with hands-on full-stack development experience in Java, Spring Boot, React, Node.js, and Django. Completed internships at VCodez and AURA Institute & Technology, focusing on frontend performance, relational database architecture, and REST API integration.',
      imageUrl: '/images/hero-developer.jpg',
      additionalInfo: [
        'Final-year B.E. Computer Science & Engineering (2023–2027) with CGPA 7.41 / 10.0',
        'Practical experience in React, Java, Spring Boot, Node.js, Express, and Django',
        'Internship exposure at VCodez and AURA Institute & Technology',
        'Committed to clean architecture, testable code, and production reliability',
      ],
      highlights: {
        create: [
          {
            title: 'Full Stack Development',
            description:
              'Building responsive, modular client interfaces in React and integrating reliable backend microservices with robust error handling.',
            icon: 'Layers',
            displayOrder: 1,
          },
          {
            title: 'Java Development',
            description:
              'Solid engineering foundation in Core Java, OOP design patterns, Collections framework, Multithreading, and Spring Boot web services.',
            icon: 'Code2',
            displayOrder: 2,
          },
          {
            title: 'Practical Web Applications',
            description:
              'Delivered end-to-end applications including an agricultural e-commerce platform and a digital aluminium recycling workflow system.',
            icon: 'Globe',
            displayOrder: 3,
          },
          {
            title: 'Problem Solving & Quality',
            description:
              'Focused on optimizing frontend render cycles, relational database indexing, clean Git version control, and maintainable project code.',
            icon: 'Cpu',
            displayOrder: 4,
          },
        ],
      },
    },
  });
  console.log('✅ About section & highlight cards seeded');

  // 4. Seed Technologies
  const techList = [
    'React',
    'Java',
    'Spring Boot',
    'Node.js',
    'Express',
    'MongoDB',
    'MySQL',
    'Django',
    'Python',
    'CSS',
    'HTML',
    'JavaScript',
    'Tailwind CSS',
    'Git',
    'Postman',
  ];

  const techMap = {};
  for (const t of techList) {
    const tech = await prisma.technology.upsert({
      where: { name: t },
      update: {},
      create: { name: t, category: 'Engineering' },
    });
    techMap[t] = tech.id;
  }
  console.log('✅ Technologies dictionary seeded');

  // 5. Seed Real Projects
  await prisma.projectTechnology.deleteMany();
  await prisma.project.deleteMany();

  const projectsData = [
    {
      title: 'Smart Agriculture Marketplace',
      slug: 'smart-agriculture-marketplace',
      category: 'E-Commerce',
      shortDescription:
        'E-commerce platform connecting farmers directly with consumers for agricultural products.',
      description:
        'A comprehensive full-stack agricultural marketplace platform eliminating intermediary commissions. Features farmer product listings, direct buyer-to-farmer orders, real-time inventory management, price discovery, and order workflow tracking.',
      problemSolved:
        'Eliminated predatory intermediary markups by establishing a direct peer-to-peer connection between regional agricultural producers and consumers.',
      myContribution:
        'Engineered Spring Boot RESTful API endpoints for catalog search and inventory updates. Connected responsive React frontend components and designed MySQL schema with proper foreign key constraints.',
      developmentApproach:
        'Decoupled multi-tier architecture with React client, Spring Boot service layer, and normalized MySQL relational schema.',
      imageUrl: '/images/project-agriculture.jpg',
      githubUrl: 'https://github.com',
      liveDemoUrl: '',
      featured: true,
      displayOrder: 1,
      techs: ['React', 'Java', 'Spring Boot', 'MySQL', 'CSS'],
    },
    {
      title: 'Smart Aluminium Recovery System',
      slug: 'smart-aluminium-recovery',
      category: 'Workflow Management',
      shortDescription:
        'Digital workflow platform for aluminium recovery and sustainable refinement.',
      description:
        'Industrial recycling workflow platform tracking scrap collection, batch smelting temperatures, recovery purity metrics, and inventory distribution.',
      problemSolved:
        'Replaced manual paper tracking with an automated real-time audit trail for recycled aluminium batch purity and inventory dispatch.',
      myContribution:
        'Architected MERN stack pipeline with custom state management and batch processing alerts.',
      developmentApproach:
        'Event-driven data logging with Express middleware and MongoDB aggregation pipelines.',
      imageUrl: '/images/project-aluminium.jpg',
      githubUrl: 'https://github.com',
      liveDemoUrl: '',
      featured: true,
      displayOrder: 2,
      techs: ['React', 'Node.js', 'Express', 'MongoDB', 'CSS'],
    },
    {
      title: 'ProjectHub — University Project Management Platform',
      slug: 'projecthub-university',
      category: 'Project Management',
      shortDescription:
        'Multi-role platform designed to streamline final-year project workflows.',
      description:
        'Centralized academic portal for final-year engineering students and faculty advisors. Manages milestone submissions, review scheduling, rubric evaluations, and documentation repositories.',
      problemSolved:
        'Eliminated scattered email threads and missed milestone deadlines through structured review workflows.',
      myContribution:
        'Built role-based authorization workflows in Django and MySQL, designing responsive React dashboards for faculty and students.',
      developmentApproach:
        'Role-based access control with granular permission checks on submission endpoints.',
      imageUrl: '/images/project-agriculture.jpg',
      githubUrl: 'https://github.com',
      liveDemoUrl: '',
      featured: false,
      displayOrder: 3,
      techs: ['React', 'Django', 'MySQL'],
    },
    {
      title: 'Medicare — Pharmacy Management System',
      slug: 'medicare-pharmacy',
      category: 'Pharmacy Management',
      shortDescription:
        'Web application designed to digitise pharmacy inventory and prescription management.',
      description:
        'Healthcare pharmacy web application supporting batch inventory tracking, prescription verification, drug interaction notices, automated re-order thresholds, and billing invoicing.',
      problemSolved:
        'Automated expiry date notifications and low-stock alerts, reducing medication stockouts and administrative dispensing errors.',
      myContribution:
        'Developed inventory alert triggers and RESTful API endpoints for prescription lookup with relational data integrity in MySQL.',
      developmentApproach:
        'Relational transactional integrity with automated threshold monitors.',
      imageUrl: '/images/project-aluminium.jpg',
      githubUrl: 'https://github.com',
      liveDemoUrl: '',
      featured: false,
      displayOrder: 4,
      techs: ['React', 'Django', 'MySQL'],
    },
  ];

  for (const p of projectsData) {
    const { techs, ...projectFields } = p;
    const createdProject = await prisma.project.create({
      data: {
        ...projectFields,
        technologies: {
          create: techs.map((t) => ({
            technology: {
              connect: { id: techMap[t] },
            },
          })),
        },
      },
    });
  }
  console.log('✅ 4 Real projects & relations seeded');

  // 6. Seed Skills
  await prisma.skill.deleteMany();
  const skillsData = [
    // Languages
    { name: 'Java', category: 'Programming Languages', note: 'Core Java, OOP, Collections, Multithreading', highlight: true, displayOrder: 1 },
    { name: 'Python', category: 'Programming Languages', note: 'Data structures, automation scripts, Django backend', highlight: true, displayOrder: 2 },
    { name: 'JavaScript', category: 'Programming Languages', note: 'ES6+, asynchronous programming, DOM APIs', highlight: true, displayOrder: 3 },
    // Frontend
    { name: 'React.js', category: 'Frontend', note: 'Functional components, custom hooks, virtual DOM', highlight: true, displayOrder: 1 },
    { name: 'HTML5', category: 'Frontend', note: 'Semantic page structure, accessibility, forms', highlight: false, displayOrder: 2 },
    { name: 'CSS3', category: 'Frontend', note: 'Flexbox, CSS Grid, responsive design, animations', highlight: false, displayOrder: 3 },
    { name: 'Tailwind CSS', category: 'Frontend', note: 'Utility-first styling, design system tokens', highlight: false, displayOrder: 4 },
    // Backend
    { name: 'Node.js', category: 'Backend', note: 'Event-driven runtime, Express servers', highlight: true, displayOrder: 1 },
    { name: 'Spring Boot', category: 'Backend', note: 'Enterprise Java web APIs, dependency injection', highlight: true, displayOrder: 2 },
    { name: 'Django', category: 'Backend', note: 'Python web framework, ORM, REST framework', highlight: false, displayOrder: 3 },
    { name: 'Express.js', category: 'Backend', note: 'RESTful API routing, custom middleware', highlight: false, displayOrder: 4 },
    // Database
    { name: 'MySQL', category: 'Database', note: 'Relational schemas, foreign keys, query optimization', highlight: true, displayOrder: 1 },
    { name: 'MongoDB', category: 'Database', note: 'Document data modeling, aggregation pipelines', highlight: false, displayOrder: 2 },
    // Tools
    { name: 'Git & GitHub', category: 'Tools & Platforms', note: 'Branching strategies, pull requests, version control', highlight: true, displayOrder: 1 },
    { name: 'VS Code', category: 'Tools & Platforms', note: 'Primary IDE, debugging, extensions', highlight: false, displayOrder: 2 },
    { name: 'Postman', category: 'Tools & Platforms', note: 'API endpoint testing, request validation', highlight: false, displayOrder: 3 },
  ];

  for (const s of skillsData) {
    await prisma.skill.create({ data: s });
  }
  console.log('✅ Technical skills matrix seeded');

  // 7. Seed Experience
  await prisma.experience.deleteMany();
  await prisma.experience.createMany({
    data: [
      {
        jobTitle: 'Full Stack Developer (Python) Intern',
        company: 'VCodez',
        startDate: 'Dec 2024',
        endDate: 'Feb 2025',
        period: 'Dec 2024 – Feb 2025',
        location: 'Chennai, India',
        summary:
          'Contributed to core full-stack web features, UI responsiveness, and database maintenance across client engagements.',
        responsibilities: [
          'Developed and deployed 5+ responsive web features using React, HTML, CSS, and JavaScript.',
          'Improved application load performance by optimizing frontend components and reducing render cycles.',
          'Maintained and updated MySQL/MongoDB database collections and queries.',
          'Collaborated with a 4-member team using Git for version control and code reviews.',
        ],
        technologies: ['React', 'Python', 'JavaScript', 'MySQL', 'MongoDB', 'Git'],
        displayOrder: 1,
      },
      {
        jobTitle: 'Java Intern',
        company: 'AURA Institute & Technology',
        startDate: 'May 2026',
        endDate: 'Jun 2026',
        period: 'May 2026 – Jun 2026',
        location: 'Chennai, India',
        summary:
          'Hands-on engineering internship building a Smart Agriculture Marketplace application with Java backend logic.',
        responsibilities: [
          'Built a Smart Agriculture Marketplace application using Java and relational databases.',
          'Implemented core product listing, browsing, and purchasing workflows.',
          'Debugged, unit-tested, and optimized backend logic and API request handlers.',
        ],
        technologies: ['Java', 'Spring Boot', 'MySQL', 'OOP', 'Collections', 'REST APIs'],
        displayOrder: 2,
      },
    ],
  });
  console.log('✅ Work & internship experience seeded');

  // 8. Seed Education
  await prisma.education.deleteMany();
  await prisma.education.create({
    data: {
      degree: 'B.E. Computer Science and Engineering',
      institution: 'J.N.N Institute of Engineering, Chennai',
      startYear: '2023',
      endYear: '2027',
      duration: '2023 – 2027',
      cgpa: '7.41 / 10.0',
      description:
        'Affiliated with Anna University. Comprehensive engineering curriculum focused on software architecture, algorithms, and database systems.',
      coursework: [
        'Data Structures & Algorithms',
        'Database Management Systems (DBMS)',
        'Object-Oriented Programming (Java/C++)',
        'Operating Systems',
        'Computer Networks',
        'Web Technology & Cloud Concepts',
      ],
      location: 'Chennai, India',
      displayOrder: 1,
    },
  });
  console.log('✅ Education record seeded');

  // 9. Seed Certificates
  await prisma.certificate.deleteMany();
  await prisma.certificate.createMany({
    data: [
      {
        title: 'Java In-Depth: Become a Complete Java Engineer',
        organization: 'Infosys',
        year: '2026',
        description:
          'Comprehensive mastery of Core Java, Object-Oriented Programming, Java Collections, and multithreading.',
        credentialId: 'INFY-JAVA-2026',
        skills: ['Java', 'OOP', 'Collections Framework', 'Multithreading', 'Software Engineering'],
        certificateUrl: 'https://infyspringboard.onwingspan.com',
        certificateImageUrl:
          'https://res.cloudinary.com/dfngk8e8p/image/upload/v1788521199/portfolio/certificates/rkt5xjvt6jeety4bjosw.png',
        certificateImagePublicId: 'portfolio/certificates/rkt5xjvt6jeety4bjosw',
        displayOrder: 1,
      },
      {
        title: 'GitHub Copilot — The Complete Guide',
        organization: 'Infosys',
        year: '2026',
        description:
          'AI-assisted development, code generation, test writing, and productivity acceleration with GitHub Copilot.',
        credentialId: 'INFY-COPILOT-2026',
        skills: ['GitHub Copilot', 'AI Pair Programming', 'Code Generation', 'Automated Testing'],
        certificateUrl: 'https://infyspringboard.onwingspan.com',
        certificateImageUrl:
          'https://res.cloudinary.com/dfngk8e8p/image/upload/v1788521212/portfolio/certificates/jn7cwvhhgtixytkklwz0.png',
        certificateImagePublicId: 'portfolio/certificates/jn7cwvhhgtixytkklwz0',
        displayOrder: 2,
      },
      {
        title: 'Python Programming',
        organization: 'CodeTantra',
        year: '2024',
        description:
          'In-depth foundation covering Python syntax, data structures, modular programming, and algorithms.',
        credentialId: 'CT-PY-2024',
        skills: ['Python', 'Data Structures', 'Functions', 'File I/O', 'Algorithm Design'],
        certificateUrl: 'https://codetantra.com',
        certificateImageUrl:
          'https://res.cloudinary.com/dfngk8e8p/image/upload/v1788521223/portfolio/certificates/w7qqaudtzbtk780rtzdd.png',
        certificateImagePublicId: 'portfolio/certificates/w7qqaudtzbtk780rtzdd',
        displayOrder: 3,
      },
    ],
  });
  console.log('✅ Verified certificates seeded');

  // 10. Seed Services
  await prisma.service.deleteMany();
  await prisma.service.createMany({
    data: [
      {
        title: 'UI/UX Development',
        description:
          'Creating responsive, user-centered interfaces with seamless accessibility and pixel-perfect design translation.',
        icon: 'Layout',
        displayOrder: 1,
      },
      {
        title: 'Frontend Development',
        description:
          'Building fast, high-performance web applications with React, modern CSS architecture, and smooth interactive states.',
        icon: 'Monitor',
        displayOrder: 2,
      },
      {
        title: 'Full-Stack Development',
        description:
          'End-to-end web solutions connecting responsive client frontends with reliable, secure, and maintainable backend servers.',
        icon: 'Layers',
        displayOrder: 3,
      },
      {
        title: 'Backend Development',
        description:
          'Engineering scalable backend architectures using Spring Boot, Django, and Node.js with strict security standards.',
        icon: 'Server',
        displayOrder: 4,
      },
      {
        title: 'REST API Development',
        description:
          'Designing structured, well-documented RESTful endpoints, request validation, authentication, and data pipelines.',
        icon: 'Cpu',
        displayOrder: 5,
      },
      {
        title: 'Database Integration',
        description:
          'Architecting relational schemas with MySQL and document collections with MongoDB, optimized for indexing and queries.',
        icon: 'Database',
        displayOrder: 6,
      },
    ],
  });
  console.log('✅ Services seeded');

  // 11. Seed Process Steps
  await prisma.process.deleteMany();
  await prisma.process.createMany({
    data: [
      {
        stepNumber: 1,
        title: 'Requirements & Architecture',
        description:
          'Analyzing problem specifications, domain entities, database schemas, and architectural boundaries before writing code.',
        icon: 'FileText',
        displayOrder: 1,
      },
      {
        stepNumber: 2,
        title: 'Design & Component Modeling',
        description:
          'Translating design mocks into modular, responsive, and reusable frontend components with clean state management.',
        icon: 'Layout',
        displayOrder: 2,
      },
      {
        stepNumber: 3,
        title: 'API & Service Implementation',
        description:
          'Implementing secure RESTful endpoints, input validation, authentication guards, and database transactions.',
        icon: 'Server',
        displayOrder: 3,
      },
      {
        stepNumber: 4,
        title: 'Testing, Deployment & Monitoring',
        description:
          'Validating cross-browser responsiveness, running integration checks, and setting up automated production pipelines.',
        icon: 'CheckCircle2',
        displayOrder: 4,
      },
    ],
  });
  console.log('✅ Engineering process steps seeded');

  // 12. Seed Contact Info
  await prisma.contactInfo.deleteMany();
  await prisma.contactInfo.create({
    data: {
      email: 'dineshdinesh48376@gmail.com',
      phone: '+91 90803 64795',
      location: 'Chennai, India',
      linkedin: 'https://linkedin.com/in/dinesh-m-0125g1980',
      github: 'https://github.com',
      otherSocialLinks: {
        twitter: 'https://twitter.com',
        discord: 'dineshm#0001',
      },
    },
  });
  console.log('✅ Contact info seeded');

  // 13. Seed Settings
  await prisma.settings.deleteMany();
  await prisma.settings.create({
    data: {
      siteTitle: 'Dinesh M | Full Stack Developer',
      metaDescription:
        'Portfolio of Dinesh M - Final-year B.E. Computer Science student specializing in Java, Spring Boot, React, Node.js, and MySQL.',
      resumeUrl: '/Dinesh_M_Resume.pdf',
    },
  });
  console.log('✅ Global website settings seeded');

  // 14. Initial Admin Activity
  await prisma.adminActivity.create({
    data: {
      adminId: admin.id,
      action: 'SYSTEM_INITIALIZED',
      entity: 'PORTFOLIO_CMS',
      details: 'Production MySQL database seeded with verified portfolio data and admin account.',
    },
  });

  console.log('✨ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
