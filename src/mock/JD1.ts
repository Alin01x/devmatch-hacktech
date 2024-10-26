import { JobDescription, ExperienceLevel } from "@/types/JobDescription";

export const JD1: JobDescription = {
  id: "uuid", // Replace with an actual UUID
  jobTitle: "Mid-level Full Stack Developer",
  experienceLevel: ExperienceLevel.Mid,
  industry: "Technology",
  detailedDescription: `
### Company Overview
Tech Innovators Inc. is a leading technology solutions provider dedicated to delivering cutting-edge software products and services. With a focus on innovation and quality, we strive to empower businesses by providing them with the tools they need to succeed in a rapidly evolving digital landscape. Our team is composed of passionate professionals who are committed to excellence and continuous improvement.

### Key Responsibilities
- Develop and maintain scalable web applications using modern front-end and back-end technologies.
- Collaborate with cross-functional teams to define, design, and ship new features.
- Ensure the performance, quality, and responsiveness of applications.
- Identify and correct bottlenecks and fix bugs.
- Participate in code reviews to maintain high-quality code standards.
- Stay up-to-date with emerging technologies and industry trends to continuously improve development processes.
- Contribute to the design and architecture of new and existing systems.

### Required Qualifications
- Bachelor’s degree in Computer Science, Information Technology, or a related field.
- 3-5 years of experience in full-stack development.
- Proficiency in front-end technologies such as HTML, CSS, JavaScript, and frameworks like React or Angular.
- Strong experience with server-side languages such as Node.js, Python, Java, or Ruby.
- Familiarity with database technologies such as MySQL, PostgreSQL, or MongoDB.
- Experience with version control systems, preferably Git.
- Solid understanding of RESTful APIs and web services.

### Preferred Skills
- Experience with cloud platforms such as AWS, Azure, or Google Cloud.
- Knowledge of containerization tools like Docker and orchestration tools like Kubernetes.
- Familiarity with CI/CD pipelines and DevOps practices.
- Strong problem-solving skills and attention to detail.
- Excellent communication and teamwork abilities.

### Benefits
- Competitive salary and performance-based bonuses.
- Comprehensive health, dental, and vision insurance.
- Flexible working hours and remote work options.
- Professional development opportunities and access to online learning resources.
- Generous paid time off and company holidays.
- Collaborative and inclusive work environment.
  `,
  skills: {
    HTML: 4,
    CSS: 4,
    JavaScript: 5,
    React: 4,
    Angular: 3,
    NodeJS: 4,
    Python: 3,
    Java: 3,
    Ruby: 2,
    MySQL: 3,
    PostgreSQL: 3,
    MongoDB: 3,
    Git: 4,
    RESTfulAPIs: 4,
    AWS: 3,
    Azure: 2,
    GoogleCloud: 2,
    Docker: 3,
    Kubernetes: 2,
    CI_CD: 3,
    DevOps: 3,
  },
  createdAt: new Date(),
};
