import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { AppShell } from "@/components/app-shell";
import {
  Field,
  GenerateButton,
  OutputPanel,
  Select,
  TextArea,
  TextInput,
} from "@/components/tool-workspace";
import { researchTopic } from "@/lib/ai.functions";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Vantage Workplace AI" },
      {
        name: "description",
        content:
          "Get a structured briefing on any work topic: insights, trade-offs, next steps and what to verify.",
      },
      { property: "og:title", content: "AI Research Assistant — Vantage Workplace AI" },
      {
        property: "og:description",
        content: "Structured briefings with insights, trade-offs and next steps.",
      },
    ],
  }),
  component: ResearchPage,
});

const DEPTHS = ["Quick scan", "Standard brief", "Deep dive"];
const ANGLES = [
  "Business strategy",
  "Technical evaluation",
  "Market & competitors",
  "Risk & compliance",
  "Customer perspective",
];

function ResearchPage() {
  const run = useServerFn(researchTopic);
  const [topic, setTopic] = useState("");
  const [context, setContext] = useState("");
  const [depth, setDepth] = useState(DEPTHS[1]);
  const [angle, setAngle] = useState(ANGLES[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (topic.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({
        data: {
          topic: context.trim() ? `${topic}\n\nAdditional context: ${context}` : topic,
          depth,
          angle,
        },
      });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Research failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Research Assistant" subtitle="Insights, trade-offs and summaries">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
          className="space-y-4 glass-card p-6"
        >
          <Field label="Topic or question">
            <TextInput
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Should we move our reporting stack to a warehouse-native model?"
            />
          </Field>

          <Field label="Context" hint="optional">
            <TextArea
              rows={6}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="Mid-size B2B SaaS, 12-person data team, current stack is Postgres + nightly ETL."
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Depth">
              <Select
                options={DEPTHS}
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
              />
            </Field>
            <Field label="Angle">
              <Select
                options={ANGLES}
                value={angle}
                onChange={(e) => setAngle(e.target.value)}
              />
            </Field>
          </div>

          <GenerateButton
            loading={loading}
            label="Compile briefing"
            disabled={topic.trim().length < 3}
          />
        </form>

        <OutputPanel
          loading={loading}
          error={error}
          output={output}
          onRegenerate={() => void generate()}
          emptyHint="Ask a work question to get a briefing with insights, trade-offs, next steps and open items to verify."
        />
      </div>
    </AppShell>
  );
}
