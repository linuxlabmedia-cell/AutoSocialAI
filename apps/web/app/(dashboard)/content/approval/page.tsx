"use client";

import { api } from "@/lib/trpc-provider";
import { PostApprovalCard } from "@/components/content/PostApprovalCard";
import { Inbox, FileText } from "lucide-react";

export default function ApprovalQueuePage() {
  const { data: posts, refetch } = api.posts.getApprovalQueue.useQuery(
    {},
    { refetchOnMount: "always", staleTime: 0 }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Approval Queue</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Review and approve AI-generated posts before they go live
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center rounded-2xl border border-[#151f35] bg-[#0d1526]">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-lg font-semibold text-white">All clear!</h3>
          <p className="text-slate-500 text-sm mt-1">
            No posts pending approval. Generate content from the Workflows page.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FileText className="w-4 h-4 text-amber-400" />
            <span><span className="text-white font-medium">{posts.length}</span> post{posts.length !== 1 ? "s" : ""} awaiting review</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {posts.map((post) => (
              <PostApprovalCard key={post.id} post={post} onAction={refetch} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
