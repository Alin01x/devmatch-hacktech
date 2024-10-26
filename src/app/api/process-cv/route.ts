import { headers } from "../_utils/requestHeaders";
import { createClient } from "@supabase/supabase-js";
import { ExperienceLevel } from "@/types/Enums";
import { extractCvData } from "../_extractors/extractCvData";

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  try {
    const { fullContent } = (await request.json()) as { fullContent: string };

    if (!fullContent) {
      return new Response(JSON.stringify({ error: "Missing CV's content." }), {
        status: 400,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    const extractedFields: {
      experienceLevel: ExperienceLevel;
      skills: string[];
      industries: string[];
    } = await extractCvData(fullContent);

    // Store CV in the database
    const { data, error } = await supabase.from("cvs").insert({
      experienceLevel: extractedFields.experienceLevel,
      skills: extractedFields.skills,
      industries: extractedFields.industries,
      fullContent,
    });

    if (error) {
      console.error("Error saving job description:", error);
      return new Response(JSON.stringify({ error: "Failed to save CV." }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Find Matching Job Descriptions

    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error processing CV:", e);
    return new Response(JSON.stringify({ error: "Failed to process CV." }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
