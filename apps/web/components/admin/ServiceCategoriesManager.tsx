"use client";

import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import { Pencil, Trash2, Copy, Layers, Eye, EyeOff } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "website-design": "bg-blue-600/10 border-blue-500/20 text-blue-400",
  "website-management": "bg-cyan-600/10 border-cyan-500/20 text-cyan-400",
  "content-management": "bg-violet-600/10 border-violet-500/20 text-violet-400",
  "meta-ads": "bg-amber-600/10 border-amber-500/20 text-amber-400",
  "seo": "bg-emerald-600/10 border-emerald-500/20 text-emerald-400",
  "social-media": "bg-pink-600/10 border-pink-500/20 text-pink-400",
  "lead-generation": "bg-orange-600/10 border-orange-500/20 text-orange-400",
  "branding": "bg-rose-600/10 border-rose-500/20 text-rose-400",
};

export function ServiceCategoriesManager() {
  const { data: categories, isLoading, refetch } = api.serviceCategories.list.useQuery();
  const deleteMutation = api.serviceCategories.delete.useMutation({ onSuccess: () => refetch() });
  const updateMutation = api.serviceCategories.update.useMutation({ onSuccess: () => refetch() });
  const duplicateMutation = api.serviceCategories.duplicate.useMutation({ onSuccess: () => refetch() });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-[#0d1424] border border-[#151f35] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories?.map((cat) => {
        const colorClass = CATEGORY_COLORS[cat.slug] ?? "bg-slate-600/10 border-slate-500/20 text-slate-400";
        return (
          <div
            key={cat.id}
            className={`flex items-start gap-4 p-4 rounded-xl bg-[#0d1424] border transition-colors ${
              cat.isActive ? "border-[#151f35]" : "border-[#151f35] opacity-50"
            }`}
          >
            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 ${colorClass}`}>
              <Layers className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-white text-sm">{cat.name}</h3>
                <span className="text-xs text-slate-600 font-mono bg-[#06090f] px-2 py-0.5 rounded">
                  {cat.slug}
                </span>
                {!cat.isActive && (
                  <span className="text-xs text-slate-600 border border-slate-700 rounded px-1.5 py-0.5">
                    Inactive
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-xs mt-1 line-clamp-2">{cat.description}</p>
              <p className="text-slate-600 text-xs mt-1.5 line-clamp-1">
                Strategy: {cat.contentStrategy.substring(0, 100)}{cat.contentStrategy.length > 100 ? "..." : ""}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <Link
                href={`/admin/categories/${cat.id}`}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-violet-300 px-2.5 py-1.5 rounded-lg hover:bg-violet-600/10 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => duplicateMutation.mutate({ id: cat.id })}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => updateMutation.mutate({ id: cat.id, data: { isActive: !cat.isActive } })}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-300 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
              >
                {cat.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${cat.name}"?`)) deleteMutation.mutate({ id: cat.id });
                }}
                className="flex items-center gap-1 text-xs text-slate-600 hover:text-rose-400 px-2.5 py-1.5 rounded-lg hover:bg-rose-600/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
