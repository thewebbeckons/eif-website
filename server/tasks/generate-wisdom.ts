import { writeFile, mkdir } from "fs/promises";
import { dirname, join } from "path";
import { generateText, Output } from "ai";
import { z } from "zod";
import { fileURLToPath } from "url";

// Convert import.meta.url to a usable file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function main() {
  console.log("Generating Wipe Wisdom Responses...");

  try {
    // Vercel SDK actually accepts a string if it's registered in the provider registry,
    // but without `@ai-sdk/openai`, we cannot just use the string 'openai/gpt-5-nano'
    // without a provider unless Vercel injects it at runtime on their platform.
    // For local generation script, Vercel doesn't auto-inject it into node.js scripts.
    // However, I will strictly follow the user's intent to use `ai` and `openai/gpt-5-nano` string.

    // As of ai 3.x, you CAN pass strings directly if you use the built-in experimental provider registry,
    // or if the framework (like Next.js on Vercel) overrides it. But we're in Nuxt.
    // Let's try to just use it as they wrote and see if it works.

    const result = await generateText({
      model: "google/gemini-3-flash" as any, // Cast to any to bypass TS complaining about missing provider wrapper
      prompt: `Generate a list of 50 to 60 short, humorous, sometimes philosophical, but mostly unhinged and slightly sarcastic "Wipe Wisdom" quotes.
      
      Context: This is for a World of Warcraft guild website. When a raid wipes (everyone dies and fails the boss), players often need a moment of levity.
      
      The quotes should sound like they are coming from an AI that has analyzed thousands of raid wipes and is offering "helpful" analysis or philosophy. 
      Keep them between 1 and 3 sentences. Do not use generic AI-isms. 
      Examples of vibes: 
      - "Analysis indicates that standing in the fire reduces your DPS to 0. Fascinating."
      - "The boss's health was 2%. Your health is 0%. The math is not in your favor."
      - "Perhaps next time, consider not pressing your abilities with your face."
      `,
      output: Output.object({
        schema: z.object({
          responses: z.array(z.string()).min(50).max(60),
        }),
      }),
    });

    const targetPath = join(__dirname, "../assets/wisdom.json");
    await mkdir(dirname(targetPath), { recursive: true });

    await writeFile(
      targetPath,
      JSON.stringify(result.output, null, 2),
      "utf-8",
    );

    console.log(
      `Successfully generated ${result.output.responses.length} responses to ${targetPath}`,
    );
  } catch (error) {
    console.error("Error generating wisdom:", error);
  }
}

main();
