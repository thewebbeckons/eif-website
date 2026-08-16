import type { H3Event } from "h3";
import { z } from "zod";

const RATE_LIMIT_MAX = 2;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const DISCORD_WEBHOOK_TIMEOUT_MS = 8_000;
const developmentAttempts = new Map<string, number[]>();

const applicationSchema = z.object({
  characterInfo: z.string().trim().min(1).max(200),
  discordTag: z.string().trim().min(1).max(100),
  message: z.string().trim().min(1).max(2000),
});

const hashIdentifier = async (value: string) => {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};

const throwRateLimitError = (): never => {
  throw createError({
    statusCode: 429,
    statusMessage:
      "You're eager! Please wait a bit before sending another application.",
  });
};

const enforceRateLimit = async (event: H3Event, identifier: string) => {
  const identifierHash = await hashIdentifier(identifier);
  const environment = getCloudflareEnvironment(event);
  const coordinatorNamespace = getRequestCoordinatorNamespace(environment);
  const now = Date.now();
  const windowMs = RATE_LIMIT_WINDOW_SECONDS * 1_000;

  if (!coordinatorNamespace) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("REQUEST_COORDINATOR binding is unavailable.");
    }

    const activeAttempts = (developmentAttempts.get(identifierHash) || [])
      .filter((submittedAt) => submittedAt > now - windowMs);
    if (activeAttempts.length >= RATE_LIMIT_MAX) throwRateLimitError();

    developmentAttempts.set(identifierHash, [...activeAttempts, now]);
    return;
  }

  const coordinator = coordinatorNamespace.getByName(
    `recruitment:${identifierHash}`,
  );
  const allowed = await coordinator.consumeRecruitmentAttempt(
    now,
    RATE_LIMIT_MAX,
    windowMs,
  );

  if (!allowed) {
    throwRateLimitError();
  }
};

const getDiscordWebhookUrl = (event: H3Event) => {
  const config = useRuntimeConfig(event);
  const environment = getCloudflareEnvironment(event);

  return (
    config.discordWebhookUrl ||
    getEnvironmentString(environment, "DISCORD_WEBHOOK_URL")
  );
};

export default defineEventHandler(async (event) => {
  const ip = getRequestIP(event, { xForwardedFor: true }) || "unknown";
  await enforceRateLimit(event, ip);

  const body = await readValidatedBody(event, (value) =>
    applicationSchema.safeParse(value),
  );

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Invalid application submission.",
    });
  }

  const webhookUrl = getDiscordWebhookUrl(event);
  if (!webhookUrl) {
    logWorkerError(
      "recruitment.credentials_missing",
      new Error("DISCORD_WEBHOOK_URL is not configured."),
    );
    throw createError({
      statusCode: 500,
      statusMessage: "Recruitment is temporarily unavailable.",
    });
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(
    () => abortController.abort(),
    DISCORD_WEBHOOK_TIMEOUT_MS,
  );

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: abortController.signal,
      body: JSON.stringify({
        username: "Recruitment Bot ✨",
        embeds: [
          {
            title: "⚔️ New Guild Application",
            color: 0xa855f7,
            fields: [
              {
                name: "Character Name & Server",
                value: body.data.characterInfo,
                inline: true,
              },
              {
                name: "Discord Tag",
                value: body.data.discordTag,
                inline: true,
              },
              {
                name: "Message",
                value: body.data.message,
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
            footer: { text: "Exercise in Futility Recruitment" },
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook returned HTTP ${response.status}.`);
    }

    return { success: true };
  } catch (error) {
    logWorkerError("recruitment.delivery_failed", error);
    throw createError({
      statusCode: 502,
      statusMessage: "Failed to submit application to the void.",
    });
  } finally {
    clearTimeout(timeoutId);
  }
});
