import { ExperienceLevel } from "./Enums";

export interface CV {
  id: string; // UUID
  fullContent: string; // Raw CV text content for semantic analysis
  experienceLevel: ExperienceLevel; // Experience level of the person
  industries: string[]; // List of industries the person has worked in
  skills: string[]; // Technical skills matching the format from JobDescription
  createdAt: Date;
}
