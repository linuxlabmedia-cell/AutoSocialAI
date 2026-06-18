"use client";

import { useParams } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { PostApprovalCard } from "@/components/content/PostApprovalCard";
import { Inbox } from "lucide-react";

export default function ClientContentPage() {
  const { clientId } = useParams<{ clientId: string }>();
  const { data: posts, refetch } = api.posts.getApprovalQueue.useQuery({ clientId });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Content</h2>
        <p className="text-slate-500 text-sm mt-1">
          Review and manage AI-generated content for this client
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-2xl border border-[#151f35] bg-[#0d1526]">
          <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-4">
            <Inbox className="w-6 h-6 text-violet-400" />
          </div>
          <h3 className="font-medium text-white">No content pending approval</h3>
          <p className="text-slate-500 text-sm mt-1">
            Click <strong className="text-slate-300">Generate 30 Days</strong> above to start generating content.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostApprovalCard key={post.id} post={post} onAction={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}
