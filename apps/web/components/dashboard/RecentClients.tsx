"use client";

import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import { Facebook, Instagram, ArrowRight, Users } from "lucide-react";

export function RecentClients() {
  const { data: clients } = api.clients.list.useQuery();

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#151f35]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <h2 className="font-semibold text-white text-sm">Clients</h2>
        </div>
        <Link
          href="/clients"
          className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-[#0f1a2e]">
        {(clients ?? []).slice(0, 6).map((client) => (
          <Link
            key={client.id}
            href={`/clients/${client.id}`}
            className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/25 to-indigo-600/15 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-sm shrink-0">
              {client.businessName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">
                {client.businessName}
              </p>
              <p className="text-xs text-slate-600">{client.industry}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {client.socialAccounts.some(
                (a) => a.platform === "FACEBOOK" && a.isConnected
              ) && <Facebook className="w-3.5 h-3.5 text-blue-500" />}
              {client.socialAccounts.some(
                (a) => a.platform === "INSTAGRAM" && a.isConnected
              ) && <Instagram className="w-3.5 h-3.5 text-pink-500" />}
              <ArrowRight className="w-3.5 h-3.5 text-slate-700 group-hover:text-slate-400 transition-colors" />
            </div>
          </Link>
        ))}

        {(clients?.length ?? 0) === 0 && (
          <div className="p-10 text-center">
            <Users className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No clients yet.</p>
            <Link
              href="/clients/new"
              className="text-xs text-violet-400 hover:text-violet-300 mt-1 inline-block transition-colors"
            >
              Add your first client →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
