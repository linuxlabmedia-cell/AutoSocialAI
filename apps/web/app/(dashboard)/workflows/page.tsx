"use client";

import { api } from "@/lib/trpc-provider";
import { Zap, Play, Clock, CheckCircle, XCircle, Loader2, Users, ArrowRight, FileText } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";

function StatusBadge({ status }: { status: string }) {
  if (status === "RUNNING") return (
    <span className="flex items-center gap-1 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-full">
      <Loader2 className="w-3 h-3 animate-spin" /> Running
    </span>
  );
  if (status === "COMPLETED") return (
    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
      <CheckCircle className="w-3 h-3" /> Done
    </span>
  );
  if (status === "FAILED") return (
    <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
      <XCircle className="w-3 h-3" /> Failed
    </span>
  );
  return (
    <span className="text-xs text-slate-500 bg-white/[0.04] border border-[#1a2540] px-2 py-0.5 rounded-full">
      {status}
    </span>
  );
}

export default function WorkflowsPage() {
  const { data: clients } = api.clients.list.useQuery();
  const { data: workflows, refetch } = api.workflows.list.useQuery({});
  const [generating, setGenerating] = useState<string | null>(null);
  const [successClientId, setSuccessClientId] = useState<string | null>(null);

  const trigger = api.workflows.trigger.useMutation({
    onSuccess: (_, vars) => {
      setGenerating(null);
      setSuccessClientId(vars.clientId);
      refetch();
    },
    onError: (err) => {
      toast.error(`Generation failed: ${err.message}`);
      setGenerating(null);
    },
  });

  const handleGenerate = (clientId: string, type: "SINGLE" | "BATCH_30") => {
    setSuccessClientId(null);
    setGenerating(`${clientId}-${type}`);
    trigger.mutate({ clientId, type, config: {} });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Workflows</h1>
          <p className="text-slate-500 mt-1 text-sm">AI content generation for your clients</p>
        </div>
        <Link
          href="/content/approval"
          className="flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-4 py-2 rounded-xl transition-colors"
        >
          <FileText className="w-4 h-4" />
          Approval Queue
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-violet-500/20 bg-violet-500/5 px-5 py-4 text-sm text-slate-400">
        <span className="text-violet-300 font-medium">How it works:</span> Click{" "}
        <span className="text-white font-medium">Generate 1 Post</span> — the AI takes ~10 seconds to write the content, then it appears in your{" "}
        <Link href="/content/approval" className="text-violet-400 hover:underline">Approval Queue</Link>.
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {(clients ?? []).map((client: any) => {
          const clientRuns = (workflows ?? []).filter((w: any) => w.clientId === client.id);
          const latestRun = clientRuns[0];
          const isGenerating = generating?.startsWith(client.id);

          return (
            <div key={client.id} className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/25 to-indigo-600/15 border border-violet-500/20 flex items-center justify-center text-violet-300 font-bold text-sm">
                    {client.businessName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{client.businessName}</p>
                    <p className="text-xs text-slate-500">{client.industry}</p>
                  </div>
                </div>
                {latestRun && <StatusBadge status={latestRun.status} />}
              </div>

              {/* Generating state */}
              {isGenerating && (
                <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 px-4 py-3 flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-violet-400 shrink-0" />
                  <div>
                    <p className="text-sm text-violet-300 font-medium">AI is writing your post...</p>
                    <p className="text-xs text-slate-500 mt-0.5">Takes ~10 seconds. Please wait.</p>
                  </div>
                </div>
              )}

              {/* Success banner */}
              {successClientId === client.id && !isGenerating && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <p className="text-sm text-emerald-300 font-medium">Post generated!</p>
                  </div>
                  <Link
                    href="/content/approval"
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors shrink-0"
                  >
                    View in Queue <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleGenerate(client.id, "SINGLE")}
                  disabled={generating !== null}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 border border-violet-500/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  {generating === `${client.id}-SINGLE` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                  Generate 1 Post
                </button>
                <button
                  onClick={() => handleGenerate(client.id, "BATCH_30")}
                  disabled={generating !== null}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  {generating === `${client.id}-BATCH_30` ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                  Generate 30 Days
                </button>
              </div>

              {latestRun && (
                <div className="text-xs text-slate-600 flex items-center gap-1 pt-1 border-t border-[#0f1a2e]">
                  <Clock className="w-3 h-3" />
                  Last run: {new Date(latestRun.startedAt).toLocaleDateString()}
                  {latestRun.postsGenerated > 0 && ` · ${latestRun.postsGenerated} posts generated`}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(clients ?? []).length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-[#151f35] bg-[#0d1526]">
          <Users className="w-10 h-10 text-slate-700 mb-4" />
          <h3 className="text-lg font-semibold text-white">No clients yet</h3>
          <p className="text-slate-500 text-sm mt-1 mb-4">Add a client first to start generating content</p>
          <Link href="/clients/new" className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
            Add First Client
          </Link>
        </div>
      )}

      {/* Recent Runs */}
      {(workflows ?? []).length > 0 && (
        <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#151f35] flex items-center justify-between">
            <h2 className="font-semibold text-white text-sm">Recent Runs</h2>
            <Link href="/content/approval" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              View posts <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-[#0f1a2e]">
            {(workflows ?? []).slice(0, 10).map((run: any) => (
              <div key={run.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm text-slate-200">{run.client?.businessName}</p>
                  <p className="text-xs text-slate-600">{new Date(run.startedAt ?? run.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  {run.postsGenerated > 0 && (
                    <span className="text-xs text-slate-500">{run.postsGenerated} posts</span>
                  )}
                  <StatusBadge status={run.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
