import { z } from "zod";

export const jobDescriptionSchema = z.object({
  jobTitle: z.string().min(3),
  industry: z.string().min(3),
  detailedDescription: z.string().min(10),
  skills: z.record(z.number()).default({}),
});
