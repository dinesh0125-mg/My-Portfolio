export const skillsData = {
  categories: [
    {
      id: "languages",
      title: "Programming Languages",
      description: "Core languages for building enterprise applications and algorithms",
      skills: [
        { name: "Java", highlight: true, note: "OOP, Collections, Multithreading, MVC" },
        { name: "Python", highlight: true, note: "Scripting, Data Structures, Django" },
        { name: "JavaScript (ES6+)", highlight: true, note: "Asynchronous JS, DOM, Modern Syntax" },
      ]
    },
    {
      id: "frontend",
      title: "Frontend Engineering",
      description: "Building responsive, modern, and accessible user interfaces",
      skills: [
        { name: "React.js", highlight: true, note: "Hooks, Components, State Management" },
        { name: "HTML5", highlight: false, note: "Semantic Structure, Accessibility" },
        { name: "CSS3", highlight: false, note: "Flexbox, Grid, Animations" },
        { name: "Tailwind CSS", highlight: true, note: "Utility-first Design Systems" },
        { name: "Responsive Web Design", highlight: false, note: "Cross-device compatibility" },
      ]
    },
    {
      id: "backend",
      title: "Backend Development",
      description: "Designing robust server-side services and APIs",
      skills: [
        { name: "Java / Spring Boot", highlight: true, note: "RESTful Endpoints, Dependency Injection" },
        { name: "Node.js", highlight: true, note: "Event-driven Runtime, REST APIs" },
        { name: "Express.js", highlight: false, note: "Middleware, Routing, Error Handling" },
        { name: "Django", highlight: false, note: "Python Web Framework, ORM" },
        { name: "RESTful API Design", highlight: true, note: "CRUD, JSON serialization, Status codes" },
      ]
    },
    {
      id: "database",
      title: "Database Management",
      description: "Data modeling, relational normalization, and NoSQL storage",
      skills: [
        { name: "MySQL", highlight: true, note: "Relational Design, SQL Queries, Joins, Indexing" },
        { name: "MongoDB", highlight: true, note: "Document Models, Aggregations, NoSQL" },
      ]
    },
    {
      id: "tools",
      title: "Tools & Technologies",
      description: "Modern developer workflow, version control, and environments",
      skills: [
        { name: "Git & GitHub", highlight: true, note: "Branching, PRs, Version Control" },
        { name: "VS Code", highlight: false, note: "Primary IDE & Extensions" },
        { name: "Postman", highlight: false, note: "API Testing & Validation" },
        { name: "Maven", highlight: false, note: "Java Build Management" },
        { name: "npm", highlight: false, note: "Package Management" },
      ]
    }
  ]
};
