import { ExperienceLevel } from "./Enums";

export type Skills = {
  [skillName: string]: number;
};

export interface JobDescription {
  id: string; // UUID
  jobTitle: string;
  experienceLevel: ExperienceLevel;
  industry: string; // Main industry the job is in
  detailedDescription: string; // Markdown to preserve formatting
  skills: Skills;
  createdAt: Date;
}
