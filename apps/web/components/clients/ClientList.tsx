"use client";

import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import { Facebook, Instagram, Zap, MoreHorizontal, Users } from "lucide-react";

export function ClientList() {
  const { data: clients, isLoading } = api.clients.list.useQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Users className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">No clients yet</h3>
        <p className="text-muted-foreground text-sm mt-1 mb-4">
          Add your first client to start generating content automatically.
        </p>
        <Link
          href="/clients/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90"
        >
          Add First Client
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {clients.map((client) => {
        const fbConnected = client.socialAccounts.some(
          (a) => a.platform === "FACEBOOK" && a.isConnected
        );
        const igConnected = client.socialAccounts.some(
          (a) => a.platform === "INSTAGRAM" && a.isConnected
        );

        return (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="rounded-xl border bg-card hover:shadow-md transition-all p-5 space-y-4 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {client.logoUrl ? (
                  <img src={client.logoUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-primary font-bold">
                    {client.businessName[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm">{client.businessName}</h3>
                  <p className="text-xs text-muted-foreground">{client.industry}</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{client._count.posts} posts</span>
              <span>·</span>
              <span className="capitalize">{client.postingFrequency.toLowerCase().replace(/_/g, " ")}</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  fbConnected ? "bg-blue-50 text-blue-600" : "bg-muted text-muted-foreground"
                }`}
              >
                <Facebook className="w-3 h-3" />
                {fbConnected ? "Connected" : "Not connected"}
              </div>
              <div
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  igConnected ? "bg-pink-50 text-pink-600" : "bg-muted text-muted-foreground"
                }`}
              >
                <Instagram className="w-3 h-3" />
                {igConnected ? "Connected" : "Not connected"}
              </div>
            </div>

            {client.autoApprove && (
              <div className="flex items-center gap-1 text-xs text-primary">
                <Zap className="w-3 h-3" /> Auto-approve enabled
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
