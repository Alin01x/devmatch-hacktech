export interface CV {
  id: string; // UUID
  full_content: string; // Raw CV text content for semantic analysis
  industries: string[]; // List of industries the person has worked in
  skills: string[]; // Technical skills matching the format from JobDescription
  createdAt: Date;
}
