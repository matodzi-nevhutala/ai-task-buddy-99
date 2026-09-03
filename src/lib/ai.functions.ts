import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { runPrompt } from "./ai-gateway.server";

const BASE_RULES = `You are Vantage, a professional workplace productivity assistant used by busy knowledge workers.
Rules:
- Be concise, specific and business-appropriate. No filler, no hype, no emoji.
- Never invent facts, names, numbers or dates that were not provided. If something is missing, mark it clearly as [confirm].
- Output clean markdown that renders well in a compact panel. Use short headings, bullets and bold labels.
- Never mention that you are an AI model or describe your own process.`;

/* -------------------------------- Email --------------------------------- */

const EmailInput = z.object({
  purpose: z.string().min(3),
  tone: z.string().min(1),
  audience: z.string().min(1),
  length: z.string().min(1),
  recipient: z.string().optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runPrompt({
      system: `${BASE_RULES}
Task: write a single ready-to-send work email.
Structure the output exactly as:
**Subject:** <one line, max 8 words>
---
<greeting>
<body: ${data.length === "Concise" ? "2-4 short sentences" : data.length === "Standard" ? "2 short paragraphs" : "3 paragraphs with a bulleted list of key points"}>
<clear call to action>
<sign-off>
Then a final section:
**Why this works** — 2 bullets on tone/audience choices made.`,
      prompt: `Purpose / context: ${data.purpose}
Tone: ${data.tone}
Audience: ${data.audience}
Length: ${data.length}
Recipient: ${data.recipient?.trim() || "not specified — use a neutral greeting"}`,
    });
    return { text };
  });

/* ---------------------------- Meeting notes ------------------------------ */

const NotesInput = z.object({
  notes: z.string().min(10),
  meetingType: z.string().min(1),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runPrompt({
      system: `${BASE_RULES}
Task: turn raw meeting notes or a transcript into an executive-ready summary.
Output exactly these sections in this order:
## Summary
One paragraph, max 3 sentences.
## Key points
3-6 bullets, each one line.
## Decisions
Bullets of decisions made. If none, write "No decisions recorded."
## Action items
A markdown table with columns: Owner | Action | Due. Use [confirm] where an owner or date was not stated.
## Risks & open questions
Up to 4 bullets. Omit the section content with "None raised." if nothing applies.`,
      prompt: `Meeting type: ${data.meetingType}

Raw notes:
"""
${data.notes}
"""`,
    });
    return { text };
  });

/* ------------------------------ Task planner ----------------------------- */

const PlannerInput = z.object({
  tasks: z.string().min(3),
  horizon: z.string().min(1),
  hours: z.number().min(1).max(16),
  workStyle: z.string().min(1),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runPrompt({
      system: `${BASE_RULES}
Task: prioritise and schedule the user's tasks.
Method: score each task on impact and urgency (Eisenhower style), then sequence them realistically inside the available hours, protecting focus blocks and leaving buffer.
Output exactly these sections:
## Priority order
A markdown table: # | Task | Priority (High/Medium/Low) | Why
## Schedule
A markdown table: Time | Task | Focus level. Fit within the stated capacity for the stated horizon.
## Deferred / delegate
Bullets for anything that does not fit, with a one-line recommendation each.
## Focus tip
One sentence tailored to the stated work style.`,
      prompt: `Planning horizon: ${data.horizon}
Available focus hours: ${data.hours}
Work style: ${data.workStyle}

Tasks (one per line, may include hints about deadlines):
"""
${data.tasks}
"""`,
    });
    return { text };
  });

/* ---------------------------- Research assistant -------------------------- */

const ResearchInput = z.object({
  topic: z.string().min(3),
  depth: z.string().min(1),
  angle: z.string().min(1),
});

export const researchTopic = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ResearchInput.parse(input))
  .handler(async ({ data }) => {
    const text = await runPrompt({
      system: `${BASE_RULES}
Task: produce a research briefing from your own knowledge. You cannot browse the web — never fabricate URLs, citations or statistics. When a figure would be needed, say what to verify instead.
Output exactly these sections:
## Executive summary
${data.depth === "Quick scan" ? "3 bullets." : "One short paragraph plus 3 bullets."}
## Key insights
${data.depth === "Deep dive" ? "5-7" : "3-5"} bullets, each with a bolded label then one sentence.
## Considerations & trade-offs
3 bullets.
## Recommended next steps
3 numbered, concrete actions.
## What to verify
2-4 bullets naming the data points a human should confirm before relying on this.`,
      prompt: `Topic: ${data.topic}
Depth: ${data.depth}
Perspective / angle: ${data.angle}`,
    });
    return { text };
  });

/* --------------------------------- Chat ---------------------------------- */

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      }),
    )
    .min(1)
    .max(40),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const transcript = data.messages
      .map((m) => `${m.role === "user" ? "User" : "Vantage"}: ${m.content}`)
      .join("\n\n");

    const text = await runPrompt({
      system: `${BASE_RULES}
You are in a live chat with a professional. Answer the latest user message using the conversation so far.
Keep replies under 180 words unless the user asks for depth. Use bullets for anything with more than two parts.
When the request is a work artefact (email, summary, plan), produce it directly rather than describing how you would.`,
      prompt: `Conversation so far:
"""
${transcript}
"""

Reply to the final user message as Vantage.`,
    });
    return { text };
  });
