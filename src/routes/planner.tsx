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
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Vantage Workplace AI" },
      {
        name: "description",
        content:
          "Prioritise your task list by impact and urgency, then get a realistic schedule for your day or week.",
      },
      { property: "og:title", content: "AI Task Planner — Vantage Workplace AI" },
      {
        property: "og:description",
        content: "Prioritisation and scheduling for a realistic, focused workday.",
      },
    ],
  }),
  component: PlannerPage,
});

const HORIZONS = ["Today", "Tomorrow", "This week"];
const STYLES = ["Deep focus blocks", "Short sprints", "Meeting-heavy day"];

function PlannerPage() {
  const run = useServerFn(planTasks);
  const [tasks, setTasks] = useState("");
  const [horizon, setHorizon] = useState(HORIZONS[0]);
  const [workStyle, setWorkStyle] = useState(STYLES[0]);
  const [hours, setHours] = useState(6);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (tasks.trim().length < 3) return;
    setLoading(true);
    setError(null);
    try {
      const res = await run({ data: { tasks, horizon, hours, workStyle } });
      setOutput(res.text);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Planning failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell title="AI Task Planner" subtitle="Prioritisation and realistic scheduling">
      <div className="grid gap-4 lg:grid-cols-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void generate();
          }}
          className="space-y-4 glass-card p-6"
        >
          <Field label="Your tasks" hint="one per line">
            <TextArea
              rows={10}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
              placeholder={
                "Confirm API data access — blocks two deliverables\nReview pricing one-pager (due Thursday)\nUpdate roadmap doc\nPrep board summary"
              }
            />
          </Field>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Horizon">
              <Select
                options={HORIZONS}
                value={horizon}
                onChange={(e) => setHorizon(e.target.value)}
              />
            </Field>
            <Field label="Work style">
              <Select
                options={STYLES}
                value={workStyle}
                onChange={(e) => setWorkStyle(e.target.value)}
              />
            </Field>
          </div>

          <Field label="Available focus hours" hint={`${hours}h`}>
            <input
              type="range"
              min={1}
              max={12}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="w-full accent-[var(--color-brand)]"
            />
          </Field>

          <GenerateButton
            loading={loading}
            label="Build my plan"
            disabled={tasks.trim().length < 3}
          />
        </form>

        <OutputPanel
          loading={loading}
          error={error}
          output={output}
          onRegenerate={() => void generate()}
          emptyHint="List your tasks to get a ranked priority table plus a time-blocked schedule."
        />
      </div>
    </AppShell>
  );
}
