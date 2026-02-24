import { generateText } from "ai";
import { z } from "zod";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

export default defineEventHandler(async (event) => {
  // 1. Rate Limiting
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  const now = Date.now();
  
  let rateData = rateLimitMap.get(ip);
  if (!rateData || now > rateData.resetTime) {
    rateData = { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };
  }

  rateData.count++;
  rateLimitMap.set(ip, rateData);

  if (rateData.count > RATE_LIMIT_MAX) {
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests. The void needs time to recharge.",
    });
  }

  // 2. Read Request Body
  const body = await readValidatedBody(event, (body) => {
    return z.object({
      classAndSpec: z.string().min(1).max(100),
    }).safeParse(body);
  });

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid input",
    });
  }

  const { classAndSpec } = body.data;

  // 3. AI Generation
  try {
    const { text } = await generateText({
      model: 'google/gemini-2.5-flash', // Using OpenAI compatibility for the gateway
      system: "You are the 'Recruitment Scout ✨'. You evaluate potential players for a midcore WoW guild. You are sarcastic, love cats, and hate toxic players. Keep it under 60 words.",
      prompt: `Class and Spec: ${classAndSpec}. Tell them if they are a good fit for 'Exercise in Futility' on US-Illidan. Be playful and refer to specific WoW mechanics or tropes.`,
      maxOutputTokens: 1000,
      temperature: 0.8,
    });

    return { feedback: text };
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "The scout's connection to the void was severed. Try again later.",
    });
  }
});
