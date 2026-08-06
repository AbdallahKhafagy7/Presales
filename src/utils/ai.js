import { OpenAI } from "openai";

function getClient() {
  return new OpenAI({
    baseURL: "https://presales-ai-26-resource.services.ai.azure.com/openai/v1",
    apiKey: process.env["OPENAI_API_KEY"],
  });
}

/**
 * Extracts the first JSON object/array from a model response that may include
 * prose or markdown code fences around the payload.
 */
export function extractJsonPayload(content) {
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI response was empty");
  }

  const trimmed = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    const objectStart = trimmed.indexOf("{");
    const arrayStart = trimmed.indexOf("[");
    const start =
      objectStart === -1
        ? arrayStart
        : arrayStart === -1
          ? objectStart
          : Math.min(objectStart, arrayStart);

    if (start === -1) {
      throw new Error("AI response did not contain valid JSON");
    }

    const endChar = trimmed[start] === "[" ? "]" : "}";
    const end = trimmed.lastIndexOf(endChar);
    if (end <= start) {
      throw new Error("AI response did not contain valid JSON");
    }

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

export default async function generateResponse(prompt) {
  const client = getClient();

  const res = await client.chat.completions.create({
    model: process.env.AI_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are a JSON API. Reply with a single valid JSON object only. Never include markdown, code fences, or explanatory text.",
      },
      { role: "user", content: prompt },
    ],
    response_format: { type: "json_object" },
  });

  return res.choices[0].message.content;
}
