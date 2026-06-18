"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { ClientProfileForm } from "@/components/clients/ClientProfileForm";

export default function ClientSettingsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client, isLoading } = api.clients.get.useQuery({ clientId });

  if (isLoading) {
    return <div className="h-64 rounded-2xl border border-[#151f35] bg-[#0d1526] animate-pulse" />;
  }

  if (!client) return <div className="text-slate-500">Client not found.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Client Settings</h2>
        <p className="text-slate-500 text-sm mt-1">
          Update brand profile and automation settings
        </p>
      </div>
      <ClientProfileForm existingClientId={clientId} />
    </div>
  );
}
