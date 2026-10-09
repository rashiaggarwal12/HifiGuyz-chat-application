import { MessageSquareTextIcon, PencilLineIcon, TrophyIcon, VideoIcon } from "lucide-react";
import { activeStreak, practicedToday } from "../lib/stats";

const Tile = ({ icon, label, value, accent }) => {
  const Icon = icon;
  return (
    <div className="glass-panel rounded-2xl p-4">
      <Icon className={`size-5 ${accent}`} />
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      <p className="text-xs text-base-content/60">{label}</p>
    </div>
  );
};

const StatsPanel = ({ stats }) => {
  const streak = activeStreak(stats);
  const doneToday = practicedToday(stats);

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-orange-400/20 bg-gradient-to-br from-orange-500/20 via-base-200 to-secondary/15 p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative flex items-center gap-5">
          <div className="grid size-16 place-items-center rounded-2xl bg-orange-500/15 text-4xl ring-1 ring-orange-400/30">
            🔥
          </div>
          <div>
            <p className="font-display text-3xl font-bold">
              {streak} day{streak === 1 ? "" : "s"}
            </p>
            <p className="text-sm text-base-content/70">
              {doneToday
                ? "You've practiced today. Keep it going tomorrow!"
                : streak > 0
                  ? "Send a message or hop on a call today to keep your streak alive."
                  : "Send a message or make a call to start a streak."}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile
          icon={TrophyIcon}
          label="Best streak"
          value={`${stats?.longestStreak || 0}d`}
          accent="text-warning"
        />
        <Tile
          icon={MessageSquareTextIcon}
          label="Messages sent"
          value={stats?.messagesSent || 0}
          accent="text-primary"
        />
        <Tile
          icon={VideoIcon}
          label="Minutes on calls"
          value={stats?.callMinutes || 0}
          accent="text-success"
        />
        <Tile
          icon={PencilLineIcon}
          label="Corrections given"
          value={stats?.correctionsGiven || 0}
          accent="text-secondary"
        />
      </div>
    </section>
  );
};
export default StatsPanel;
