import { headers } from "../_utils/requestHeaders";
import fs from "fs";
import mammoth from "mammoth";
import { handleCvMatching } from "../cv-matching/route";

export async function GET(request: Request) {
  try {
    // Read all .docx files from project root /DataSet/cv/
    const cvLocations = process.cwd() + "/DataSet/cv/";
    const files = fs.readdirSync(cvLocations);

    const fileContents: string[] = [];

    for (const file of files) {
      if (file.endsWith(".docx")) {
        const filePath = `${cvLocations}${file}`;
        const arrayBuffer = fs.readFileSync(filePath);

        const result = await mammoth.extractRawText({ buffer: arrayBuffer });
        const text = result.value;

        fileContents.push(text);
      }
    }

    console.log(`Importing ${fileContents.length} CVs...`);

    for (const fullContent of fileContents) {
      await handleCvMatching(fullContent);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error processing CV:", e);
    return new Response(JSON.stringify({ error: "Failed to import CVs." }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
}
