"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/trpc-provider";
import { LayoutTemplate, Check, Loader2, Save, Info } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function ClientApprovedTemplates({ clientId }: { clientId: string }) {
  const { data: allTemplates, isLoading: loadingAll } = api.templates.list.useQuery({
    activeOnly: true,
  });
  const { data: approvedTemplates, isLoading: loadingApproved, refetch } =
    api.templates.getApprovedForClient.useQuery({ clientId });

  const setApprovedMutation = api.templates.setApprovedForClient.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Approved templates saved");
    },
    onError: () => toast.error("Failed to save templates"),
  });

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  // Initialize selected from DB once loaded
  useEffect(() => {
    if (!loadingApproved && approvedTemplates && !initialized) {
      setSelected(new Set(approvedTemplates.map((t) => t.id)));
      setInitialized(true);
    }
  }, [approvedTemplates, loadingApproved, initialized]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setApprovedMutation.mutate({ clientId, templateIds: Array.from(selected) });
  };

  if (loadingAll || loadingApproved) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!allTemplates?.length) {
    return (
      <div className="text-center py-16 border border-dashed border-[#151f35] rounded-xl">
        <LayoutTemplate className="w-10 h-10 text-slate-700 mx-auto mb-3" />
        <p className="text-slate-400 font-medium">No templates in your library yet</p>
        <p className="text-slate-600 text-sm mt-1 mb-4">
          Create templates in the Template Library first
        </p>
        <Link
          href="/templates/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Go to Template Library
        </Link>
      </div>
    );
  }

  // Group by category
  const grouped = allTemplates.reduce<Record<string, typeof allTemplates>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category]!.push(t);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white">Approved Creative Templates</h2>
          <p className="text-slate-500 text-sm mt-1">
            Click templates to approve or unapprove them, then hit Save.
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 bg-[#0d1424] border border-[#151f35] rounded-lg px-3 py-2 w-fit">
            <Info className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            The AI will only use approved templates when generating content for this client.
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={setApprovedMutation.isPending}
          className="shrink-0 flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          {setApprovedMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save ({selected.size} approved)
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSelected(new Set(allTemplates.map((t) => t.id)))}
          className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
        >
          Approve all
        </button>
        <span className="text-slate-700">·</span>
        <button
          onClick={() => setSelected(new Set())}
          className="text-xs text-slate-500 hover:text-slate-300 underline underline-offset-2 transition-colors"
        >
          Clear all
        </button>
      </div>

      {/* Template list grouped by category */}
      {Object.entries(grouped).map(([category, templates]) => (
        <div key={category}>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            {category}
          </h3>
          <div className="space-y-2">
            {templates?.map((template) => {
              const isApproved = selected.has(template.id);
              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => toggle(template.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150 cursor-pointer ${
                    isApproved
                      ? "bg-violet-600/10 border-violet-500/40 hover:bg-violet-600/15"
                      : "bg-[#0d1424] border-[#151f35] hover:border-violet-500/20 hover:bg-[#0f1830]"
                  }`}
                >
                  {/* Checkbox */}
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      isApproved
                        ? "bg-violet-600 border-violet-500"
                        : "border-slate-600 bg-[#06090f]"
                    }`}
                  >
                    {isApproved && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>

                  {/* Thumbnail */}
                  {template.exampleImageUrl ? (
                    <img
                      src={template.exampleImageUrl}
                      alt={template.name}
                      className="w-14 h-14 object-cover rounded-lg shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#06090f] rounded-lg flex items-center justify-center shrink-0 border border-[#151f35]">
                      <LayoutTemplate className="w-5 h-5 text-slate-700" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${isApproved ? "text-white" : "text-slate-400"}`}>
                      {template.name}
                    </p>
                    {template.description && (
                      <p className="text-slate-600 text-xs mt-0.5 line-clamp-1">
                        {template.description}
                      </p>
                    )}
                    {template.marketingObjective && (
                      <p className="text-violet-400/70 text-xs mt-1 font-medium">
                        {template.marketingObjective}
                      </p>
                    )}
                  </div>

                  {/* Status */}
                  <span
                    className={`text-xs font-semibold shrink-0 px-2.5 py-1 rounded-full border ${
                      isApproved
                        ? "bg-violet-600/20 border-violet-500/30 text-violet-300"
                        : "bg-transparent border-slate-700 text-slate-600"
                    }`}
                  >
                    {isApproved ? "✓ Approved" : "Not approved"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Bottom save bar */}
      <div className="sticky bottom-4 bg-[#0a0f1c] border border-violet-500/20 rounded-xl p-4 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          <span className="text-violet-300 font-semibold">{selected.size}</span> of {allTemplates.length} templates approved for this client
        </p>
        <button
          onClick={handleSave}
          disabled={setApprovedMutation.isPending}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          {setApprovedMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </button>
      </div>
    </div>
  );
}
