"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "@/lib/trpc-provider";
import { Check, X, ExternalLink, FileText } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export function ApprovalQueue() {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const { data, refetch } = api.posts.getDashboardQueue.useQuery();
  const approve = api.posts.approve.useMutation({
    onSuccess: () => { toast.success("Post approved"); refetch(); },
  });
  const reject = api.posts.reject.useMutation({
    onSuccess: () => { toast.success("Post rejected"); refetch(); },
  });

  const queue = data?.pendingApproval ?? [];

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#151f35]">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-400" />
          <h2 className="font-semibold text-white text-sm">Approval Queue</h2>
        </div>
        {queue.length > 0 && (
          <Link
            href="/content/approval"
            className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            View all ({queue.length})
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>

      <div className="divide-y divide-[#0f1a2e]">
        {queue.length === 0 ? (
          <div className="p-10 text-center">
            <Check className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-slate-600">All clear — nothing pending</p>
          </div>
        ) : (
          queue.slice(0, 5).map((post) => (
            <div key={post.id} className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                {post.imageUrl ? (
                  <button
                    onClick={() => setLightboxUrl(post.imageUrl!)}
                    className="shrink-0 rounded-xl overflow-hidden ring-0 hover:ring-2 hover:ring-violet-500/60 transition-all"
                  >
                    <Image
                      src={post.imageUrl}
                      alt=""
                      width={40}
                      height={40}
                      className="w-10 h-10 object-cover"
                    />
                  </button>
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600/20 to-orange-600/10 border border-amber-500/20 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-500">
                    {post.client.businessName}
                  </p>
                  <p className="text-sm text-slate-200 line-clamp-2 mt-0.5">
                    {post.caption}
                  </p>
                  {post.qaScore !== null && post.qaScore !== undefined && (
                    <p className="text-xs text-slate-600 mt-1">
                      QA{" "}
                      <span className="text-emerald-400 font-medium">
                        {(Number(post.qaScore) * 100).toFixed(0)}%
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => approve.mutate({ postId: post.id })}
                  disabled={approve.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  <Check className="w-3 h-3" /> Approve
                </button>
                <button
                  onClick={() => reject.mutate({ postId: post.id })}
                  disabled={reject.isPending}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X className="w-3 h-3" /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <img
            src={lightboxUrl}
            alt=""
            className="max-w-[90vw] max-h-[90vh] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
