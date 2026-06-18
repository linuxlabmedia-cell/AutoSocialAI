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
          <div key={i} className="h-48 rounded-2xl border border-[#151f35] bg-[#0d1526] animate-pulse" />
        ))}
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-[#151f35] bg-[#0d1526]">
        <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
          <Users className="w-6 h-6 text-violet-400" />
        </div>
        <h3 className="text-lg font-semibold text-white">No clients yet</h3>
        <p className="text-slate-500 text-sm mt-1 mb-4">
          Add your first client to start generating content automatically.
        </p>
        <Link
          href="/clients/new"
          className="bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
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
            className="rounded-2xl border border-[#151f35] bg-[#0d1526] hover:border-violet-500/30 card-glow transition-all p-5 space-y-4 group"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {client.logoUrl ? (
                  <img
                    src={client.logoUrl}
                    alt={client.businessName}
                    className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-[#1a2540]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/25 to-indigo-600/15 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold">
                    {client.businessName[0]}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-sm text-white">{client.businessName}</h3>
                  <p className="text-xs text-slate-500">{client.industry}</p>
                </div>
              </div>
              <MoreHorizontal className="w-4 h-4 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{client._count.posts} posts</span>
              <span>·</span>
              <span className="capitalize">{client.postingFrequency.toLowerCase().replace(/_/g, " ")}</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                  fbConnected
                    ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    : "bg-white/[0.03] text-slate-600 border-[#1a2540]"
                }`}
              >
                <Facebook className="w-3 h-3" />
                {fbConnected ? "Connected" : "Not connected"}
              </div>
              <div
                className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full border ${
                  igConnected
                    ? "bg-pink-500/10 text-pink-400 border-pink-500/20"
                    : "bg-white/[0.03] text-slate-600 border-[#1a2540]"
                }`}
              >
                <Instagram className="w-3 h-3" />
                {igConnected ? "Connected" : "Not connected"}
              </div>
            </div>

            {client.autoApprove && (
              <div className="flex items-center gap-1 text-xs text-violet-400">
                <Zap className="w-3 h-3" /> Auto-approve enabled
              </div>
            )}
          </Link>
        );
      })}
    </div>
  );
}
