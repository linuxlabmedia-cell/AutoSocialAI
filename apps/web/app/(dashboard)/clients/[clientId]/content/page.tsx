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
        <h2 className="text-lg font-semibold">Content</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review and manage AI-generated content for this client
        </p>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border bg-card">
          <Inbox className="w-10 h-10 text-muted-foreground mb-3" />
          <h3 className="font-medium">No content pending approval</h3>
          <p className="text-muted-foreground text-sm mt-1">
            Click <strong>Generate 30 Days</strong> above to start generating content.
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
