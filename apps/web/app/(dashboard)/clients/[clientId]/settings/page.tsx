"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { ClientProfileForm } from "@/components/clients/ClientProfileForm";

export default function ClientSettingsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading } = api.clients.get.useQuery({ clientId });

  if (isLoading) {
    return <div className="h-64 bg-muted animate-pulse rounded-xl" />;
  }

  if (!client) return <div className="text-muted-foreground">Client not found.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Client Settings</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Update brand profile and automation settings
        </p>
      </div>
      <ClientProfileForm existingClientId={clientId} />
    </div>
  );
}
