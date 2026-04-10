"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Target,
  TrendingUp,
  Plus,
  X,
  Check,
  ChevronDown,
} from "lucide-react";

interface Goal {
  id: string;
  name: string;
  eventType: string;
  current: number;
  target: number;
  change: number;
  deadline: string;
}

const initialGoals: Goal[] = [
  {
    id: "1",
    name: "Monthly Signups",
    eventType: "signup",
    current: 842,
    target: 1000,
    change: 18.2,
    deadline: "Apr 30",
  },
  {
    id: "2",
    name: "Trial to Paid",
    eventType: "purchase",
    current: 234,
    target: 300,
    change: 22.5,
    deadline: "Apr 30",
  },
  {
    id: "3",
    name: "Revenue Target",
    eventType: "purchase",
    current: 12480,
    target: 15000,
    change: 15.8,
    deadline: "Apr 30",
  },
  {
    id: "4",
    name: "Form Submissions",
    eventType: "form",
    current: 380,
    target: 500,
    change: 8.4,
    deadline: "Apr 30",
  },
];

const eventTypeOptions = [
  { value: "signup", label: "Signup" },
  { value: "purchase", label: "Purchase" },
  { value: "form", label: "Form Submit" },
  { value: "click", label: "Click" },
  { value: "download", label: "Download" },
  { value: "pageview", label: "Pageview" },
];

export function GoalsManager() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [showCreate, setShowCreate] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: "", eventType: "signup", target: "" });

  const handleCreate = () => {
    if (!newGoal.name || !newGoal.target) return;
    const goal: Goal = {
      id: String(Date.now()),
      name: newGoal.name,
      eventType: newGoal.eventType,
      current: 0,
      target: Number(newGoal.target),
      change: 0,
      deadline: "May 31",
    };
    setGoals([...goals, goal]);
    setNewGoal({ name: "", eventType: "signup", target: "" });
    setShowCreate(false);
  };

  return (
    <div className="rounded-xl border bg-white dark:bg-surface border-black/[0.04] dark:border-white/[0.04] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-ink dark:text-white">Goals</h3>
          <p className="text-xs text-ghost mt-0.5">Track progress toward targets</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all",
            showCreate
              ? "bg-ember/[0.08] text-ember"
              : "bg-jade/[0.08] text-jade hover:bg-jade/[0.12]"
          )}
        >
          {showCreate ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
          {showCreate ? "Cancel" : "New Goal"}
        </button>
      </div>

      {/* Inline create form */}
      {showCreate && (
        <div className="mb-4 p-3 rounded-lg border border-jade/20 bg-jade/[0.03] dark:bg-jade/[0.04] space-y-2.5">
          <input
            type="text"
            placeholder="Goal name..."
            value={newGoal.name}
            onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
            className={cn(
              "w-full px-3 py-1.5 text-xs rounded-lg border transition-colors",
              "bg-white dark:bg-surface border-black/[0.06] dark:border-white/[0.06]",
              "text-ink dark:text-white placeholder:text-ghost/60",
              "focus:outline-none focus:border-jade/40 focus:ring-1 focus:ring-jade/20"
            )}
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <select
                value={newGoal.eventType}
                onChange={(e) => setNewGoal({ ...newGoal, eventType: e.target.value })}
                className={cn(
                  "w-full appearance-none px-3 py-1.5 pr-7 text-xs rounded-lg border transition-colors",
                  "bg-white dark:bg-surface border-black/[0.06] dark:border-white/[0.06]",
                  "text-ink dark:text-white",
                  "focus:outline-none focus:border-jade/40 focus:ring-1 focus:ring-jade/20"
                )}
              >
                {eventTypeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-ghost pointer-events-none" />
            </div>
            <input
              type="number"
              placeholder="Target"
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
              className={cn(
                "w-24 px-3 py-1.5 text-xs rounded-lg border transition-colors",
                "bg-white dark:bg-surface border-black/[0.06] dark:border-white/[0.06]",
                "text-ink dark:text-white placeholder:text-ghost/60",
                "focus:outline-none focus:border-jade/40 focus:ring-1 focus:ring-jade/20"
              )}
            />
          </div>
          <button
            onClick={handleCreate}
            disabled={!newGoal.name || !newGoal.target}
            className={cn(
              "w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium rounded-lg transition-all",
              newGoal.name && newGoal.target
                ? "bg-jade text-white hover:bg-jade-hover"
                : "bg-mist dark:bg-white/[0.04] text-ghost cursor-not-allowed"
            )}
          >
            <Check className="w-3 h-3" />
            Create Goal
          </button>
        </div>
      )}

      {/* Goals list */}
      <div className="space-y-3.5">
        {goals.map((goal) => {
          const pct = Math.min((goal.current / goal.target) * 100, 100);
          const isRevenue = goal.name.includes("Revenue");
          const display = isRevenue
            ? `$${(goal.current / 1000).toFixed(1)}k / $${(goal.target / 1000).toFixed(0)}k`
            : `${goal.current.toLocaleString()} / ${goal.target.toLocaleString()}`;

          return (
            <div key={goal.id} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <Target className="w-3 h-3 text-ghost/50" />
                  <span className="text-xs font-medium text-ink dark:text-white">{goal.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-ghost tabular-nums">{display}</span>
                  {goal.change > 0 && (
                    <span className="text-[11px] font-semibold text-jade flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3" />
                      {goal.change}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="h-1.5 bg-mist dark:bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-700",
                      pct >= 80 ? "bg-jade" : pct >= 50 ? "bg-gold" : "bg-sapphire"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-ghost/50">{pct.toFixed(0)}%</span>
                  <span className="text-[10px] text-ghost/50">Due {goal.deadline}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
