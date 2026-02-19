import { StatCards } from "@/components/dashboard/StatCards";
import { RecentCases } from "@/components/dashboard/RecentCases";
import { UpcomingTasks } from "@/components/dashboard/UpcomingTasks";
import { getAdvisorFirstName } from "@/lib/advisor";
import { useXP } from "@/lib/xp";

const Index = () => {
  const firstName = getAdvisorFirstName();
  const xp = useXP();
  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-10">
      {/* Greeting */}
      <div>
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">
          {greeting}, <span className="text-gold">{firstName}</span>
          {xp.level >= 2 && (
            <span className="ml-2 text-lg font-normal text-gold/70">
              — {xp.title}
            </span>
          )}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground/50 font-mono tracking-wide">{dateStr}</p>
      </div>

      {/* Stat Cards */}
      <StatCards />

      {/* Recent Cases — full width */}
      <RecentCases />

      {/* Upcoming Tasks */}
      <UpcomingTasks />
    </div>
  );
};

export default Index;
