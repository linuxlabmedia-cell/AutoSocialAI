"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { ClientHeader } from "@/components/clients/ClientHeader";
import { ClientStatsCards } from "@/components/clients/ClientStatsCards";
import { RecentPostsGrid } from "@/components/content/RecentPostsGrid";

export default function ClientOverviewPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading } = api.clients.get.useQuery({ clientId });
  const { data: stats } = api.clients.getStats.useQuery({ clientId });

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-24 bg-muted rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!client) return <div className="text-muted-foreground">Client not found.</div>;

  return (
    <div className="space-y-6">
      <ClientHeader client={client} />
      {stats && <ClientStatsCards stats={stats} />}
      <RecentPostsGrid clientId={clientId} />
    </div>
  );
}
