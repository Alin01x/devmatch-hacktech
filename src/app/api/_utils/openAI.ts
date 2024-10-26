import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GPTRequestOptions {
  userRequest: string | object;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export async function sendGPTRequest({
  userRequest,
  systemPrompt = "You are a helpful assistant.",
  model = "gpt-4o-mini",
  temperature = 0.7,
  maxTokens = 250,
}: GPTRequestOptions): Promise<string> {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content:
          typeof userRequest === "string"
            ? userRequest
            : JSON.stringify(userRequest),
      },
    ];

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content || "";
  } catch (error) {
    console.error("Error in GPT request:", error);
    throw new Error("Failed to process GPT request");
  }
}
