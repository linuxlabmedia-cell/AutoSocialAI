"use client";

import Image from "next/image";
import { api } from "@/lib/trpc-provider";
import { cn, getStatusColor } from "@/lib/utils";
import { Images, ImageIcon } from "lucide-react";

export function RecentPostsGrid({ clientId }: { clientId: string }) {
  const { data } = api.posts.list.useQuery({ clientId, limit: 9 });
  const posts = data?.posts ?? [];

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] p-10 text-center">
        <Images className="w-6 h-6 text-slate-700 mx-auto mb-2" />
        <p className="text-slate-600 text-sm">No posts yet. Generate your first batch to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#151f35]">
        <Images className="w-4 h-4 text-violet-400" />
        <h3 className="font-semibold text-white text-sm">Recent Posts</h3>
      </div>
      <div className="grid grid-cols-3 gap-px bg-[#151f35]">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-[#06090f] group overflow-hidden">
            {post.imageUrl ? (
              <Image src={post.imageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 text-xs text-slate-600">
                <ImageIcon className="w-4 h-4 text-slate-700" />
                {post.status === "GENERATING" ? "Generating..." : "No image"}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
              <span className={cn("text-xs px-2 py-0.5 rounded-full self-start mb-1", getStatusColor(post.status))}>
                {post.status.replace(/_/g, " ")}
              </span>
              <p className="text-white text-xs line-clamp-2">{post.caption.slice(0, 60)}...</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
