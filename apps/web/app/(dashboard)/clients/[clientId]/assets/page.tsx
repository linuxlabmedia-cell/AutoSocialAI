"use client";

import { useParams } from "next/navigation";
import { ClientHeader } from "@/components/clients/ClientHeader";
import { ClientAssets } from "@/components/clients/ClientAssets";
import { api } from "@/lib/trpc-provider";

export default function ClientAssetsPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: client } = api.clients.get.useQuery({ clientId });

  if (!client) return null;

  return (
    <div className="space-y-6">
      <ClientHeader client={client as any} />
      <ClientAssets clientId={clientId} />
    </div>
  );
}
