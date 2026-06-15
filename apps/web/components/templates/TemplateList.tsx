"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import {
  LayoutTemplate,
  Pencil,
  Trash2,
  Search,
  Eye,
  EyeOff,
  Tag,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "Market Update": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Neighborhood Spotlight": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "Property Management Tip": "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "Rental Market Insight": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "Investment Insight": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "FAQ Graphic": "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "Educational Post": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  "Customer Testimonial": "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
}

export function TemplateList() {
  const [search, setSearch] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  const { data: templates, isLoading, refetch } = api.templates.list.useQuery({ activeOnly });
  const deleteMutation = api.templates.delete.useMutation({ onSuccess: () => refetch() });
  const updateMutation = api.templates.update.useMutation({ onSuccess: () => refetch() });

  const filtered = templates?.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  // Group by category
  const grouped = filtered?.reduce<Record<string, typeof filtered>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category]!.push(t);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-48 rounded-xl bg-[#0d1424] border border-[#151f35] animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-9 pr-4 py-2 bg-[#0d1424] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-violet-500/50"
          />
        </div>
        <button
          onClick={() => setActiveOnly(!activeOnly)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            activeOnly
              ? "bg-violet-600/20 border-violet-500/30 text-violet-300"
              : "bg-[#0d1424] border-[#151f35] text-slate-400 hover:text-slate-300"
          }`}
        >
          {activeOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          {activeOnly ? "Active only" : "All templates"}
        </button>
        <span className="text-sm text-slate-500">{filtered?.length ?? 0} templates</span>
      </div>

      {/* Empty state */}
      {!filtered?.length && (
        <div className="text-center py-20 border border-dashed border-[#151f35] rounded-xl">
          <LayoutTemplate className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No templates yet</p>
          <p className="text-slate-600 text-sm mt-1">
            Create your first template to start building a creative library
          </p>
          <Link
            href="/templates/new"
            className="inline-flex items-center gap-2 mt-4 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Create Template
          </Link>
        </div>
      )}

      {/* Grouped grid */}
      {Object.entries(grouped ?? {}).map(([category, items]) => (
        <div key={category}>
          <div className="flex items-center gap-2 mb-3">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
              {category}
            </h2>
            <span className="text-xs text-slate-600">({items.length})</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((template) => (
              <div
                key={template.id}
                className={`relative group rounded-xl border bg-[#0d1424] transition-all duration-200 hover:border-violet-500/30 overflow-hidden ${
                  template.isActive ? "border-[#151f35]" : "border-[#151f35] opacity-60"
                }`}
              >
                {/* Example image */}
                {template.exampleImageUrl ? (
                  <div className="h-36 overflow-hidden">
                    <img
                      src={template.exampleImageUrl}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-36 bg-gradient-to-br from-violet-900/20 to-indigo-900/10 flex items-center justify-center">
                    <LayoutTemplate className="w-10 h-10 text-violet-800" />
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white text-sm truncate">{template.name}</h3>
                      <span
                        className={`inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}
                      >
                        {template.category}
                      </span>
                    </div>
                    {!template.isActive && (
                      <span className="text-xs text-slate-600 border border-slate-700 rounded px-1.5 py-0.5 shrink-0">
                        Inactive
                      </span>
                    )}
                  </div>

                  {template.description && (
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2">{template.description}</p>
                  )}

                  {template.marketingObjective && (
                    <p className="text-violet-400/70 text-xs mt-2 font-medium">
                      ↳ {template.marketingObjective}
                    </p>
                  )}

                  {/* Industries */}
                  {template.industries.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.industries.slice(0, 3).map((ind) => (
                        <span
                          key={ind}
                          className="text-xs px-1.5 py-0.5 bg-[#151f35] text-slate-500 rounded"
                        >
                          {ind}
                        </span>
                      ))}
                      {template.industries.length > 3 && (
                        <span className="text-xs text-slate-600">
                          +{template.industries.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#151f35]">
                    <Link
                      href={`/templates/${template.id}`}
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-300 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Link>
                    <button
                      onClick={() =>
                        updateMutation.mutate({
                          templateId: template.id,
                          data: { isActive: !template.isActive },
                        })
                      }
                      className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-300 transition-colors"
                    >
                      {template.isActive ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      {template.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${template.name}"?`)) {
                          deleteMutation.mutate({ templateId: template.id });
                        }
                      }}
                      className="ml-auto flex items-center gap-1.5 text-xs text-slate-600 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
