export type Skills = {
  [skillName: string]: number;
};

export interface JobDescription {
  id: string; // UUID
  job_title: string;
  industry: string; // Main industry the job is in
  detailed_description: string; // Markdown to preserve formatting
  skills: Skills;
  createdAt: Date;
}
