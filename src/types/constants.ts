import { JobDescription } from './JobDescription';
import { MatchingCV, MatchResult } from './MatchResult';

// Sample CV and JobDescription objects (you'll need to replace these with actual data)
export interface CVMatch extends Omit<MatchResult, 'cv' | 'jobDescription'> {
    name: string
}

export const MATCH_RESULT_SAMPLES: CVMatch[] = [
    {
    name: "Jane Smith",
    score: {
        industryKnowledgeScore: 98,
        technicalSkillsScore: 96,
        jobDescriptionMatchScore: 95,
        finalScore: 96,
        matchExplanation: "Exceptional match across all areas. This candidate is an excellent fit for the position."
    }
    },
  {
    name: "John Doe",
    score: {
      industryKnowledgeScore: 85,
      technicalSkillsScore: 92,
      jobDescriptionMatchScore: 88,
      finalScore: 90,
      matchExplanation: "Strong technical skills and industry knowledge with excellent job description match."
    }
  },
  {
    name: "Jane Smith",
    score: {
      industryKnowledgeScore: 70,
      technicalSkillsScore: 80,
      jobDescriptionMatchScore: 75,
      finalScore: 76,
      matchExplanation: "Good technical skills but could improve industry knowledge for a better match."
    }
  },
  {
    name: "Jane Smith",
    score: {
      industryKnowledgeScore: 95,
      technicalSkillsScore: 65,
      jobDescriptionMatchScore: 80,
      finalScore: 78,
      matchExplanation: "Excellent industry knowledge, but technical skills could be improved to better match the job requirements."
    }
  },
  {
    name: "Jane Smith",
    score: {
      industryKnowledgeScore: 60,
      technicalSkillsScore: 55,
      jobDescriptionMatchScore: 50,
      finalScore: 54,
      matchExplanation: "Moderate match across all areas. Significant improvement needed in all aspects for a better fit."
    }
  },
];

export interface JobMatch extends Omit<JobDescription, 'skills'> {
    skills: string[]
}

export const SAMPLE_JOB_MATCH: JobMatch = {
    id: "1",
    job_title: "Senior Full Stack Developer",
    industry: "Information Technology",
    detailed_description: `
# Job Description

**Objective**

We seek a developer proficient in React, Node.js, and TypeScript for full-stack web application development.

**Key Requirements**

- 5+ years full-stack experience
- Expertise in React, Node.js, TypeScript
- Familiarity with AWS and MongoDB
- Strong problem-solving skills

**Responsibilities**

- Develop and maintain web applications
- Ensure code quality and performance
- Collaborate with cross-functional teams

**Questions**

#### What's your experience with React and Node.js?

#### How have you used AWS in previous projects?

#### Describe a challenging bug you've fixed recently.

**Assessment**

***Technical skills and experience will be evaluated through a coding challenge and technical interview.***

**Next Steps**

1. Resume review
2. Initial phone screening
3. Technical assessment
4. On-site interview
5. Reference check
`,
    skills: ["React", 'Node.js', 'TypeScript', 'AWS', 'MongoDB'],
    createdAt: new Date("2023-04-01")
};

export const NEW_MATCH_RESULT_SAMPLE_CV: MatchingCV = {
    
    "cv": {
        "id": "28fc8d28-b6b2-47a9-9296-e1cd3028faf6",
        "full_content": "Irina Cătălina Munteanu\n\nTechnical Skills\n\n- JavaScript, ReactJS, Node.js- Java, Spring Boot, SQL- Python, Django, PostgreSQL- AWS, Docker, Kubernetes- HTML, CSS, Bootstrap- TypeScript, AngularJS\n\nForeign Languages\n\n- English: C1- Spanish: B2- French: A2\n\nEducation\n\n- University Name: University of Bucharest- Program Duration: 4 years- Master Degree Name: University Politehnica of Bucharest- Program Duration: 2 years\n\nCertifications\n\n- AWS Certified Solutions Architect – Associate- Certified Kubernetes Administrator (CKA)- Oracle Certified Professional, Java SE 11 Developer\n\nProject Experience\n\n1. **Inventory Management System**   Developed a robust inventory management system using Java, Spring Boot, and SQL to streamline warehouse operations and improve stock tracking. Implemented RESTful APIs to facilitate seamless data exchange between the frontend and backend, enhancing user experience and system efficiency. Leveraged Oracle database for secure data storage and retrieval, ensuring data integrity and consistency. Technologies and tools used: Java, Spring Boot, SQL, Oracle Database, RESTful APIs.2. **Real-time Analytics Dashboard**   Created a real-time analytics dashboard using ReactJS and Node.js to provide business insights and visualize key performance metrics. Integrated WebSocket for live data updates, enabling users to make informed decisions based on the latest information. Deployed the application on AWS, utilizing services such as EC2 and S3 for scalable and reliable performance. Technologies and tools used: JavaScript, ReactJS, Node.js, WebSocket, AWS EC2, AWS S3.\n\n",
        "industries": [
            "Technology",
            "Software Development"
        ],
        "skills": [
            "JavaScript",
            "ReactJS",
            "Node.js",
            "Java",
            "Spring Boot",
            "SQL",
            "Python",
            "Django",
            "PostgreSQL",
            "AWS",
            "Docker",
            "Kubernetes",
            "HTML",
            "CSS",
            "Bootstrap",
            "TypeScript",
            "AngularJS"
        ],
        "name": "Irina Cătălina Munteanu",
        "createdAt": new Date('2024-10-26T21:24:21.956223+00:00')
    },
    "industryScore": 100,
    "industryReasoning": "Direct experience in Technology",
    "technicalScore": 0.55,
    "technicalReasoning": "Technical Skills Analysis:\n  Matched skills (6): Java, Python, AWS, Docker, SQL, Kubernetes\n  Missing skills (5): C#, React, Angular, Vue.js, NoSQL\n  \n  Detailed Scoring:\n  Java: Present (Weight: 10.0%, Contribution: 10.0%)\nPython: Present (Weight: 10.0%, Contribution: 10.0%)\nC#: Missing (Weight: 10.0%, Contribution: 0.0%)\nAWS: Present (Weight: 10.0%, Contribution: 10.0%)\nDocker: Present (Weight: 10.0%, Contribution: 10.0%)\nReact: Missing (Weight: 20.0%, Contribution: 0.0%)\nAngular: Missing (Weight: 5.0%, Contribution: 0.0%)\nVue.js: Missing (Weight: 5.0%, Contribution: 0.0%)\nSQL: Present (Weight: 10.0%, Contribution: 10.0%)\nNoSQL: Missing (Weight: 5.0%, Contribution: 0.0%)\nKubernetes: Present (Weight: 5.0%, Contribution: 5.0%)",
    "technicalSkillsMatched": [
        "Java",
        "Python",
        "AWS",
        "Docker",
        "SQL",
        "Kubernetes"
    ],
    "technicalSkillsMissing": [
        "C#",
        "React",
        "Angular",
        "Vue.js",
        "NoSQL"
    ],
    "technicalDetailedScoring": {
        "Java": {
            "present": true,
            "weight": 10,
            "contribution": 10
        },
        "Python": {
            "present": true,
            "weight": 10,
            "contribution": 10
        },
        "C#": {
            "present": false,
            "weight": 10,
            "contribution": 0
        },
        "AWS": {
            "present": true,
            "weight": 10,
            "contribution": 10
        },
        "Docker": {
            "present": true,
            "weight": 10,
            "contribution": 10
        },
        "React": {
            "present": false,
            "weight": 20,
            "contribution": 0
        },
        "Angular": {
            "present": false,
            "weight": 5,
            "contribution": 0
        },
        "Vue.js": {
            "present": false,
            "weight": 5,
            "contribution": 0
        },
        "SQL": {
            "present": true,
            "weight": 10,
            "contribution": 10
        },
        "NoSQL": {
            "present": false,
            "weight": 5,
            "contribution": 0
        },
        "Kubernetes": {
            "present": true,
            "weight": 5,
            "contribution": 5
        }
    },
    "overallScore": 66.61682242990655,
    "finalScore": 98,
    'bestMatchReasoning': 'Because and of course',
    "overallAnalysis": {
        "aiScore": 0.8,
        "aiReasoning": "The candidate, Irina Cătălina Munteanu, demonstrates a strong alignment with the technical skills required for the Junior Tech Lead position. She possesses experience with Java, Python, and SQL, which are essential programming languages mentioned in the job description. Additionally, her familiarity with AWS and Docker aligns well with the preferred skills, particularly given her AWS Certified Solutions Architect certification and experience deploying applications on AWS. However, she does not explicitly mention experience with C#, which is a key requirement, and her experience with front-end frameworks is primarily focused on ReactJS, with no mention of Angular or Vue.js. Her educational background in relevant fields and certifications further enhance her qualifications. Overall, while there are some gaps in C# and additional front-end frameworks, her strong technical skills and relevant project experience make her a good fit for the role.",
        "naturalLanguageScore": 0.1308411214953271,
        "naturalLanguageReasoning": "Natural language analysis found 23 relevant matches:\n- Strong matches: project, project, project, technologies, facilitate\n- Key missing terms: company, overview, innovative, solutions, committed\n- Overall semantic similarity: 13.1%"
    }
};