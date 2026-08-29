import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const NUTRITION_TOOL = {
  name: "log_nutrition",
  description:
    "Record the estimated nutrition information for the food shown in the photo.",
  input_schema: {
    type: "object" as const,
    properties: {
      items: {
        type: "array",
        description: "Each distinct food or drink item visible in the photo.",
        items: {
          type: "object",
          properties: {
            name: { type: "string", description: "Short name of the food item." },
            servingDescription: {
              type: "string",
              description: 'Estimated portion, e.g. "1 cup (150g)".',
            },
            calories: { type: "number" },
            proteinG: { type: "number" },
            carbsG: { type: "number" },
            fatG: { type: "number" },
          },
          required: [
            "name",
            "servingDescription",
            "calories",
            "proteinG",
            "carbsG",
            "fatG",
          ],
        },
      },
      totalCalories: { type: "number" },
      totalProteinG: { type: "number" },
      totalCarbsG: { type: "number" },
      totalFatG: { type: "number" },
      notes: {
        type: "string",
        description:
          "Brief caveats about the estimate, e.g. assumptions made about portion size or hidden ingredients like oil.",
      },
      mealName: {
        type: "string",
        description: 'Short overall name for the meal, e.g. "Grilled chicken salad".',
      },
    },
    required: [
      "items",
      "totalCalories",
      "totalProteinG",
      "totalCarbsG",
      "totalFatG",
      "notes",
      "mealName",
    ],
  },
};

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server is missing ANTHROPIC_API_KEY. Add it to your .env file." },
      { status: 500 }
    );
  }

  let body: { base64?: string; mediaType?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { base64, mediaType } = body;
  if (!base64 || !mediaType) {
    return NextResponse.json(
      { error: "Missing image data." },
      { status: 400 }
    );
  }

  const allowedMediaTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedMediaTypes.includes(mediaType)) {
    return NextResponse.json({ error: "Unsupported image type." }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 1024,
      tools: [NUTRITION_TOOL],
      tool_choice: { type: "tool", name: "log_nutrition" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as
                  | "image/jpeg"
                  | "image/png"
                  | "image/webp"
                  | "image/gif",
                data: base64,
              },
            },
            {
              type: "text",
              text: "You are a nutrition coach reviewing a photo of a meal. Identify each distinct food/drink item, estimate its portion size from visual cues, and estimate calories and macronutrients (protein, carbs, fat in grams) as accurately as you can. Use the log_nutrition tool to report your findings. If the photo doesn't clearly show food, still call the tool with your best guess and explain the uncertainty in notes.",
            },
          ],
        },
      ],
    });

    const toolUse = message.content.find(
      (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    if (!toolUse) {
      return NextResponse.json(
        { error: "The model did not return structured nutrition data." },
        { status: 502 }
      );
    }

    return NextResponse.json({ analysis: toolUse.input });
  } catch (err) {
    console.error("analyze-food error", err);
    const message =
      err instanceof Anthropic.APIError
        ? err.message
        : "Failed to analyze the photo. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
