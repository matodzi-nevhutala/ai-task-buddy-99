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
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Vantage Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional work emails tuned to tone, audience and length with AI in seconds.",
      },
      { property: "og:title", content: "Smart Email Generator — Vantage Workplace AI" },
      {
        property: "og:description",
        content: "Draft professional work emails tuned to tone, audience and length.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Confident", "Friendly", "Formal", "Direct", "Apologetic", "Persuasive"];
const AUDIENCES = [
  "Client",
  "Executive",
  "Teammate",
  "Direct report",
  "Vendor",
  "Candidate",
];
const LENGTHS = ["Concise", "Standard", "Detailed"];

function EmailPage() {
  const run = useServerFn(generateEmail);
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [tone, setTone] = useState(TONES[0]);
  const [audience, setAudience] = useState(AUDIENCES[0]);
  const [length, setLength] = useState(LENGTHS[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (purpose.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { purpose, tone, audience, length, recipient } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="Smart Email Generator" subtitle="Tone & audience aware drafting">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
          className="space-y-4 glass-card p-6"
        >
          <Field label="What do you need to say?">
            <TextArea
              rows={5}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Follow up on the reporting module scope and confirm the May 24 delivery date."
            />
          </Field>

          <Field label="Recipient" hint="optional">
            <TextInput
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Jordan, Head of Ops"
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Tone">
              <Select
                options={TONES}
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              />
            </Field>
            <Field label="Audience">
              <Select
                options={AUDIENCES}
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </Field>
            <Field label="Length">
              <Select
                options={LENGTHS}
                value={length}
                onChange={(e) => setLength(e.target.value)}
              />
            </Field>
          </div>

          <GenerateButton
            loading={loading}
            label="Generate draft"
            disabled={purpose.trim().length < 3}
          />
        </form>

        <OutputPanel
          loading={loading}
          error={error}
          output={output}
          onRegenerate={() => void generate()}
          emptyHint="Describe the email and pick a tone — your draft appears here, ready to review and send."
        />
      </div>
    </AppShell>
  );
}
