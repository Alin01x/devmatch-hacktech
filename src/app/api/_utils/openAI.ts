import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface GPTRequestOptions {
  userRequest: string;
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
  maxTokens = 8048,
}: GPTRequestOptions) {
  try {
    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: userRequest,
      },
    ];

    const response = await openai.chat.completions.create({
      model: model,
      messages: messages,
      temperature: temperature,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "");
  } catch (error) {
    console.error("Error in GPT request:", error);
    throw new Error("Failed to process GPT request");
  }
}
