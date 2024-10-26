import { headers } from "../_utils/requestHeaders";
import { extractCvData } from "../_extractors/extractCvData";
import { supabase } from "@/lib/supabase";

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
      name: string;
      skills: string[];
      industries: string[];
    } = await extractCvData(fullContent);

    const profile = {
      name: extractedFields.name,
      skills: extractedFields.skills,
      industries: extractedFields.industries,
      role: "",
      full_content: fullContent,
    };

    // Store CV in the database
    const { error } = await supabase.from("cvs").insert(profile);

    if (error) {
      console.error("Error saving job description:", error);
      return new Response(JSON.stringify({ error: "Failed to save CV." }), {
        status: 500,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // Find Matching Job Descriptions

    return new Response(JSON.stringify(profile), {
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
