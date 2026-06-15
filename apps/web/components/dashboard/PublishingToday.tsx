"use client";

import { api } from "@/lib/trpc-provider";
import { formatDateTime, getStatusColor, cn } from "@/lib/utils";
import { Clock, Zap } from "lucide-react";
import Image from "next/image";

export function PublishingToday() {
  const { data } = api.posts.getDashboardQueue.useQuery();
  const scheduled = data?.scheduled ?? [];

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#151f35]">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-400" />
          <h2 className="font-semibold text-white text-sm">Publishing Today</h2>
        </div>
        <span className="text-xs text-slate-500 bg-white/[0.04] px-2 py-0.5 rounded-full border border-[#1a2540]">
          {scheduled.length} post{scheduled.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="divide-y divide-[#0f1a2e]">
        {scheduled.length === 0 ? (
          <div className="p-10 text-center">
            <Clock className="w-6 h-6 text-slate-700 mx-auto mb-2" />
            <p className="text-sm text-slate-600">No posts scheduled for today</p>
          </div>
        ) : (
          scheduled.slice(0, 8).map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors"
            >
              {post.imageUrl ? (
                <Image
                  src={post.imageUrl}
                  alt=""
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-[#1a2540]"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">
                  {post.client.businessName}
                </p>
                <p className="text-xs text-slate-600 truncate">
                  {post.caption.slice(0, 60)}…
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span
                  className={cn(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    getStatusColor(post.status)
                  )}
                >
                  {post.status.replace(/_/g, " ")}
                </span>
                {post.scheduledAt && (
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDateTime(post.scheduledAt)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
