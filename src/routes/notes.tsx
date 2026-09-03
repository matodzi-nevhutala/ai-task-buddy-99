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
} from "@/components/tool-workspace";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Vantage Workplace AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into key points, decisions, owners and deadlines with AI.",
      },
      {
        property: "og:title",
        content: "Meeting Notes Summarizer — Vantage Workplace AI",
      },
      {
        property: "og:description",
        content: "Key points, decisions, action items and deadlines from raw notes.",
      },
    ],
  }),
  component: NotesPage,
});

const TYPES = [
  "Team sync",
  "Client call",
  "Leadership review",
  "1:1",
  "Workshop",
  "Interview",
];

function NotesPage() {
  const run = useServerFn(summarizeNotes);
  const [notes, setNotes] = useState("");
  const [meetingType, setMeetingType] = useState(TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (notes.trim().length < 10) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { notes, meetingType } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Summarization failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      subtitle="Key points, decisions, actions and deadlines"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
          className="space-y-4 glass-card p-6"
        >
          <Field label="Raw notes or transcript">
            <TextArea
              rows={14}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={
                "Paste your messy notes here — bullet fragments and transcripts both work.\n\ne.g. pricing locked 49/mo, Maya sending onboarding deck by Fri, beta signups close 20 May, risk: API migration blocks two deliverables"
              }
            />
          </Field>

          <Field label="Meeting type">
            <Select
              options={TYPES}
              value={meetingType}
              onChange={(e) => setMeetingType(e.target.value)}
            />
          </Field>

          <GenerateButton
            loading={loading}
            label="Summarize meeting"
            disabled={notes.trim().length < 10}
          />
        </form>

        <OutputPanel
          loading={loading}
          error={error}
          output={output}
          onRegenerate={() => void generate()}
          emptyHint="Paste notes on the left to get a summary, decisions and an owner/due action table."
        />
      </div>
    </AppShell>
  );
}
