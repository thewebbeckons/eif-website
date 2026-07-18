import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { generateText, Output } from "ai";
import { z } from "zod";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log("Generating Wipe Wisdom responses…");

  const result = await generateText({
    model: "google/gemini-3-flash",
    prompt: `Generate a list of 50 to 60 short, humorous, sometimes philosophical, but mostly unhinged and slightly sarcastic "Wipe Wisdom" quotes.

Context: This is for a World of Warcraft guild website. When a raid wipes (everyone dies and fails the boss), players often need a moment of levity.

The quotes should sound like they are coming from an AI that has analyzed thousands of raid wipes and is offering "helpful" analysis or philosophy.
Keep them between 1 and 3 sentences. Do not use generic AI-isms.
Examples of vibes:
- "Analysis indicates that standing in the fire reduces your DPS to 0. Fascinating."
- "The boss's health was 2%. Your health is 0%. The math is not in your favor."
- "Perhaps next time, consider not pressing your abilities with your face."`,
    output: Output.object({
      schema: z.object({
        responses: z.array(z.string()).min(50).max(60),
      }),
    }),
  });

  const targetPath = join(
    scriptDirectory,
    "../server/assets/wisdom.json",
  );
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, JSON.stringify(result.output, null, 2), "utf-8");

  console.log(
    `Generated ${result.output.responses.length} responses in ${targetPath}`,
  );
}

try {
  await main();
} catch (error) {
  console.error("Failed to generate wisdom", error);
  process.exitCode = 1;
}
