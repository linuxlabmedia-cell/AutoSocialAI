"use client";

import Image from "next/image";
import { api } from "@/lib/trpc-provider";
import { cn, getStatusColor, formatDate } from "@/lib/utils";

export function RecentPostsGrid({ clientId }: { clientId: string }) {
  const { data } = api.posts.list.useQuery({ clientId, limit: 9 });
  const posts = data?.posts ?? [];

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-muted-foreground text-sm">No posts yet. Generate your first batch to get started.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Recent Posts</h3>
      </div>
      <div className="grid grid-cols-3 gap-px bg-border">
        {posts.map((post) => (
          <div key={post.id} className="relative aspect-square bg-card group overflow-hidden">
            {post.imageUrl ? (
              <Image src={post.imageUrl} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-muted text-xs text-muted-foreground">
                {post.status === "GENERATING" ? "Generating..." : "No image"}
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100">
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
