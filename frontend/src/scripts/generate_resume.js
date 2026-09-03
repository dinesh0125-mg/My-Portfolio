// Script to generate a clean, valid PDF 1.4 Resume for Dinesh M
import fs from 'fs';
import path from 'path';

function createPdf() {
  const contentLines = [
    "DINESH M",
    "Full Stack Developer | Chennai, India",
    "Email: dineshdinesh48376@gmail.com | Phone: +91 90803 64795",
    "LinkedIn: linkedin.com/in/dinesh-m-0125g1980 | GitHub: github.com",
    "----------------------------------------------------------------------------------------------------",
    "PROFESSIONAL SUMMARY",
    "Final-year B.E. Computer Science & Engineering student with hands-on experience in full-stack web",
    "development using React, Node.js, and Spring Boot. Built production-ready applications including a",
    "Smart Agriculture Marketplace and a University Project Management Platform. Seeking a Full Stack",
    "Developer / Java Developer role to deliver scalable, user-centric web applications.",
    "",
    "EDUCATION",
    "Bachelor of Engineering (B.E.) in Computer Science and Engineering",
    "J.N.N Institute of Engineering, Chennai (2023 - 2027) | CGPA: 7.41 / 10.0",
    "Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, OOSE.",
    "",
    "TECHNICAL SKILLS",
    "Programming Languages: Java, Python, JavaScript (ES6+)",
    "Frontend Development: React.js, HTML5, CSS3, Tailwind CSS, Responsive Web Design",
    "Backend Development: Java, Spring Boot, Node.js, Express.js, Django, RESTful APIs",
    "Databases: MySQL, MongoDB, Relational Schema Design, Query Optimization",
    "Tools & Platforms: Git, GitHub, VS Code, Postman, Maven, npm",
    "",
    "INTERNSHIP EXPERIENCE",
    "1. Full Stack Developer (Python) Intern - VCodez (Dec 2024 - Feb 2025)",
    "   - Developed and deployed 5+ responsive web features using React, HTML, CSS, and JavaScript.",
    "   - Optimized frontend rendering cycles and component performance to improve page loads.",
    "   - Maintained MySQL and MongoDB databases for data integrity.",
    "   - Collaborated with 4-member team using Git for version control and peer reviews.",
    "",
    "2. Java Intern - AURA Institute & Technology (May 2026 - Jun 2026)",
    "   - Built Smart Agriculture Marketplace web application using Java.",
    "   - Implemented product listing, browsing, and checkout workflows.",
    "   - Debugged and optimized backend data handling and application logic.",
    "",
    "KEY PROJECTS",
    "1. Smart Agriculture Marketplace (React, Java, Spring Boot, MySQL)",
    "   - E-commerce platform connecting farmers directly with consumers for transparent crop trade.",
    "   - Developed full-stack architecture with Spring Boot REST APIs and React frontend.",
    "",
    "2. Smart Aluminium Recovery System (React, Node.js, Express, MongoDB)",
    "   - Digital workflow platform for industrial aluminium recycling and yield tracking.",
    "   - Engineered batch intake logging and material purity grading metrics.",
    "",
    "3. ProjectHub - University Project Management Platform (React, Django, MySQL)",
    "   - Multi-role evaluation workflow streamlining final-year project submissions and guide reviews.",
    "",
    "4. Medicare - Pharmacy Management System (React, Django, MySQL)",
    "   - Digital prescription queue and inventory monitor with batch expiration warning engine.",
    "",
    "CERTIFICATIONS",
    "- Java In-Depth: Become a Complete Java Engineer - Infosys (2026)",
    "- GitHub Copilot: The Complete Guide - Infosys (2026)",
    "- Python Programming - CodeTantra (2024)"
  ];

  // Escape special PDF characters
  function escapePdf(text) {
    return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  }

  // Construct PDF stream
  let streamContent = "BT\n";
  let y = 780;
  
  for (let i = 0; i < contentLines.length; i++) {
    const line = contentLines[i];
    if (i === 0) {
      streamContent += `/F2 16 Tf\n50 ${y} Td\n(${escapePdf(line)}) Tj\n`;
      y -= 20;
    } else if (i === 1) {
      streamContent += `/F2 11 Tf\n50 ${y} Td\n(${escapePdf(line)}) Tj\n`;
      y -= 16;
    } else if (i === 2 || i === 3) {
      streamContent += `/F1 9 Tf\n50 ${y} Td\n(${escapePdf(line)}) Tj\n`;
      y -= 14;
    } else if (line.startsWith("---")) {
      streamContent += `/F1 8 Tf\n50 ${y} Td\n(${escapePdf(line)}) Tj\n`;
      y -= 16;
    } else if (["PROFESSIONAL SUMMARY", "EDUCATION", "TECHNICAL SKILLS", "INTERNSHIP EXPERIENCE", "KEY PROJECTS", "CERTIFICATIONS"].includes(line)) {
      y -= 6;
      streamContent += `/F2 11 Tf\n50 ${y} Td\n(${escapePdf(line)}) Tj\n`;
      y -= 16;
    } else if (line === "") {
      y -= 8;
    } else {
      const isHeader = line.includes(" - ") || line.includes("1. ") || line.includes("2. ") || line.includes("3. ") || line.includes("4. ");
      const font = isHeader ? "/F2 9.5 Tf" : "/F1 9 Tf";
      streamContent += `${font}\n50 ${y} Td\n(${escapePdf(line)}) Tj\n`;
      y -= 13;
    }
  }
  streamContent += "ET\n";

  const streamLength = Buffer.byteLength(streamContent, 'utf-8');

  const pdfBody = `%PDF-1.4
1 0 obj
<<
  /Type /Catalog
  /Pages 2 0 R
>>
endobj
2 0 obj
<<
  /Type /Pages
  /Kids [3 0 R]
  /Count 1
>>
endobj
3 0 obj
<<
  /Type /Page
  /Parent 2 0 R
  /MediaBox [0 0 612 842]
  /Contents 4 0 R
  /Resources <<
    /Font <<
      /F1 5 0 R
      /F2 6 0 R
    >>
  >>
>>
endobj
4 0 obj
<<
  /Length ${streamLength}
>>
stream
${streamContent}endstream
endobj
5 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica
>>
endobj
6 0 obj
<<
  /Type /Font
  /Subtype /Type1
  /BaseFont /Helvetica-Bold
>>
endobj
xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000000 00000 n 
0000000000 00000 n 
trailer
<<
  /Size 7
  /Root 1 0 R
>>
startxref
${streamLength + 400}
%%EOF
`;

  const outputPath = path.resolve('public', 'Dinesh_M_Resume.pdf');
  fs.writeFileSync(outputPath, pdfBody);
  console.log('PDF generated at:', outputPath);
}

createPdf();
