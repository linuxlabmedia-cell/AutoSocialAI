"use client";

import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import { Pencil, Trash2, Copy, Globe, Eye, EyeOff, Search } from "lucide-react";
import { useState } from "react";

export function IndustriesManager() {
  const [search, setSearch] = useState("");

  const { data: industries, isLoading, refetch } = api.industries.list.useQuery();
  const deleteMutation = api.industries.delete.useMutation({ onSuccess: () => refetch() });
  const updateMutation = api.industries.update.useMutation({ onSuccess: () => refetch() });
  const duplicateMutation = api.industries.duplicate.useMutation({ onSuccess: () => refetch() });

  const filtered = industries?.filter(
    (ind) =>
      ind.name.toLowerCase().includes(search.toLowerCase()) ||
      ind.slug.toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-20 rounded-xl bg-[#0d1424] border border-[#151f35] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search industries..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1424] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <span className="text-sm text-slate-500">{filtered?.length ?? 0} industries</span>
      </div>

      <div className="space-y-2">
        {filtered?.map((industry) => (
          <div
            key={industry.id}
            className={`flex items-start gap-4 p-4 rounded-xl bg-[#0d1424] border transition-colors ${
              industry.isActive ? "border-[#151f35]" : "border-[#151f35] opacity-50"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <Globe className="w-4 h-4 text-blue-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-white text-sm">{industry.name}</h3>
                <span className="text-xs text-slate-600 font-mono bg-[#06090f] px-2 py-0.5 rounded">
                  {industry.slug}
                </span>
                {!industry.isActive && (
                  <span className="text-xs text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-1 truncate">{industry.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-slate-600">
                  Tone: <span className="text-slate-400">{industry.tone.substring(0, 50)}{industry.tone.length > 50 ? "..." : ""}</span>
                </span>
                <span className="text-xs text-slate-700">·</span>
                <span className="text-xs text-slate-600">
                  {industry.keywords.length} keywords
                </span>
                <span className="text-xs text-slate-700">·</span>
                <span className="text-xs text-slate-600">
                  {industry.compatibleCategories.length} services
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/admin/industries/${industry.id}`}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-300 px-2.5 py-1.5 rounded-lg hover:bg-violet-600/10 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => duplicateMutation.mutate({ id: industry.id })}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateMutation.mutate({ id: industry.id, data: { isActive: !industry.isActive } })}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {industry.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${industry.name}"?`)) deleteMutation.mutate({ id: industry.id });
                }}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-rose-600/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
