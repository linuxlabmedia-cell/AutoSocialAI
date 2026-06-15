import { getSession } from "@/lib/session";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { PublishingToday } from "@/components/dashboard/PublishingToday";
import { ApprovalQueue } from "@/components/dashboard/ApprovalQueue";
import { RecentClients } from "@/components/dashboard/RecentClients";

export default async function DashboardPage() {
  const session = await getSession();
  const firstName = session.fullName?.split(" ")[0] ?? "there";

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  })();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">
          {greeting},{" "}
          <span className="text-gradient">{firstName}</span>
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Here&apos;s what&apos;s happening with your social media today.
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PublishingToday />
        </div>
        <div className="space-y-6">
          <ApprovalQueue />
        </div>
      </div>

      <RecentClients />
    </div>
  );
}
