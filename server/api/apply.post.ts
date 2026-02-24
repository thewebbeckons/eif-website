import { z } from "zod";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 2; // Allow 2 applications per window
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

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
      statusMessage: "You're eager! But please wait a bit before sending another application.",
    });
  }

  const body = await readValidatedBody(event, (body) => {
    return z.object({
      characterInfo: z.string().min(1).max(200),
      discordTag: z.string().min(1).max(100),
      message: z.string().min(1).max(2000),
    }).safeParse(body);
  });

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid application submission.",
    });
  }

  const { characterInfo, discordTag, message } = body.data;
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("Missing DISCORD_WEBHOOK_URL in environment.");
    // We send a 500 error, but you could also mock success in dev mode if preferred
    throw createError({
      statusCode: 500,
      statusMessage: "Server configuration error. Discord Webhook missing.",
    });
  }

  try {
    const payload = {
      // Name of the bot sending the message
      username: "Recruitment Bot ✨",
      // Embed format makes it look nice with colored borders
      embeds: [
        {
          title: "⚔️ New Guild Application",
          color: 0xa855f7, // Purple color matching the site theme
          fields: [
            {
              name: "Character Name & Server",
              value: characterInfo,
              inline: true,
            },
            {
              name: "Discord Tag",
              value: discordTag,
              inline: true,
            },
            {
              name: "Message",
              value: message,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
          footer: {
            text: "Exercise in Futility Recruitment",
          },
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("Discord webhook responded with error", await response.text());
      throw new Error(`Discord Webhook failed with status ${response.status}`);
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send application to Discord:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to submit application to the void.",
    });
  }
});
