import { OpenAI } from "openai";

function getClient() {
  return new OpenAI({
    baseURL: "https://presales-ai-26-resource.services.ai.azure.com/openai/v1",
    apiKey: process.env["OPENAI_API_KEY"],
  });
}

export default async function generateResponse(prompt) {
  const client = getClient();

  const res = await client.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content;
}
