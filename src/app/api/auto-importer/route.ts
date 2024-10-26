import { headers } from "../_utils/requestHeaders";
import { extractCvData } from "../_extractors/extractCvData";
import { supabase } from "@/lib/supabase";
import fs from "fs";
import mammoth from "mammoth";

export async function GET(request: Request) {
  try {
    // Read all .docx files from project root /DataSet/cv/
    const cvLocations = process.cwd() + "/DataSet/cv/";
    const files = fs.readdirSync(cvLocations);

    // remove first 10 files
    files.splice(0, 10);

    let i = 0;

    let fileContents: string[] = [];

    for (const file of files) {
      if (i > 20) break;
      if (file.endsWith(".docx")) {
        const filePath = `${cvLocations}${file}`;
        const arrayBuffer = fs.readFileSync(filePath);

        const result = await mammoth.extractRawText({ buffer: arrayBuffer });
        const text = result.value;

        fileContents.push(text);
        i++;
      }
    }

    console.log("files", files);

    for (const fullContent of fileContents) {
      if (!fullContent) {
        return new Response(
          JSON.stringify({ error: "Missing CV's content." }),
          {
            status: 400,
            headers: { ...headers, "Content-Type": "application/json" },
          }
        );
      }

      const extractedFields: {
        name: string;
        skills: string[];
        industries: string[];
      } = await extractCvData(fullContent);

      // Store CV in the database
      const { data, error } = await supabase.from("cvs").insert({
        name: extractedFields.name,
        skills: extractedFields.skills,
        industries: extractedFields.industries,
        full_content: fullContent,
      });

      if (error) {
        console.error("Error saving job description:", error);
        return new Response(JSON.stringify({ error: "Failed to save CV." }), {
          status: 500,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
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
