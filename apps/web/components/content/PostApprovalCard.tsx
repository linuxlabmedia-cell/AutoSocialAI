"use client";

import { useState } from "react";
import { Check, X, Edit2, Hash, ImageIcon } from "lucide-react";
import { api } from "@/lib/trpc-provider";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Post = {
  id: string;
  caption: string;
  hashtags: string[];
  imageUrl?: string | null;
  imagePrompt?: string | null;
  postType: string;
  topic?: string | null;
  creativeCategory?: string | null;
  headline?: string | null;
  supportingText?: string | null;
  ctaText?: string | null;
  marketingObjective?: string | null;
  qaScore?: unknown;
  qaResults?: unknown;
  client: { businessName: string; logoUrl?: string | null; brandColors?: string[] };
};

export function PostApprovalCard({ post, onAction }: { post: Post; onAction: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCaption, setEditedCaption] = useState(post.caption);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(post.imageUrl ?? null);

  const genImage = api.posts.generateImage.useMutation({
    onSuccess: (updated) => {
      setLocalImageUrl(updated.imageUrl ?? null);
      setImageLoaded(false);
      setImageError(false);
      toast.success("Image generated!");
    },
    onError: (err) => toast.error(err.message),
  });

  const approve = api.posts.approve.useMutation({
    onSuccess: () => { toast.success("Post approved and scheduled!"); onAction(); },
    onError: (err) => toast.error(err.message),
  });
  const reject = api.posts.reject.useMutation({
    onSuccess: () => { toast.success("Post rejected"); onAction(); },
    onError: (err) => toast.error(err.message),
  });
  const update = api.posts.update.useMutation({
    onSuccess: () => { setIsEditing(false); toast.success("Caption updated"); onAction(); },
    onError: (err) => toast.error(err.message),
  });

  const qaScore = post.qaScore ? Number(post.qaScore) * 100 : null;
  const postTypeLabel = post.postType.replace(/_/g, " ");
  const brandColor = post.client.brandColors?.[0];

  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="aspect-square relative bg-[#06090f]">
        {localImageUrl && !imageError ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0d1526] via-[#1a2540] to-[#0d1526] animate-pulse flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
              </div>
            )}
            <img
              src={localImageUrl}
              alt={post.caption}
              className={cn(
                "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-4">
            {genImage.isPending ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-400 rounded-full animate-spin" />
                <p className="text-xs text-violet-400 font-medium">Generating image<span className="animate-pulse">...</span></p>
                <p className="text-xs text-slate-600">This takes ~30–60 seconds</p>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-violet-500" />
                </div>
                {post.imagePrompt && (
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{post.imagePrompt}</p>
                )}
                <button
                  onClick={() => genImage.mutate({ postId: post.id })}
                  className="px-4 py-2 text-xs font-medium bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors"
                >
                  Generate Image
                </button>
              </>
            )}
          </div>
        )}
        {/* Post type badge */}
        <div className="absolute top-3 left-3">
          <span className="text-xs bg-black/60 backdrop-blur-sm text-slate-300 border border-white/10 px-2 py-1 rounded-full">
            {postTypeLabel}
          </span>
        </div>
        {qaScore !== null && (
          <div className="absolute top-3 right-3">
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm border",
              qaScore >= 80
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : qaScore >= 60
                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                : "bg-red-500/20 text-red-300 border-red-500/30"
            )}>
              {qaScore.toFixed(0)}%
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Client */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px] font-bold shrink-0"
            style={{ background: brandColor ?? "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            {post.client.businessName[0]?.toUpperCase()}
          </div>
          <p className="text-xs text-slate-500 font-medium">{post.client.businessName}</p>
          {(post.creativeCategory || post.topic) && (
            <span className="ml-auto text-xs text-slate-700 truncate max-w-[120px]">
              {post.creativeCategory ?? post.topic}
            </span>
          )}
        </div>

        {/* Headline */}
        {post.headline && !isEditing && (
          <p className="text-sm font-bold text-white leading-snug">{post.headline}</p>
        )}

        {/* Caption */}
        {isEditing ? (
          <textarea
            value={editedCaption}
            onChange={(e) => setEditedCaption(e.target.value)}
            rows={5}
            className="w-full text-sm bg-[#06090f] border border-[#1a2540] rounded-xl p-3 text-slate-200 placeholder-slate-700 resize-none focus:outline-none focus:border-violet-500/50"
            autoFocus
          />
        ) : (
          <p className="text-sm text-slate-300 line-clamp-4 leading-relaxed">{post.caption}</p>
        )}

        {/* Hashtags */}
        {!isEditing && post.hashtags.length > 0 && (
          <div className="flex items-start gap-1.5">
            <Hash className="w-3 h-3 text-violet-500 mt-0.5 shrink-0" />
            <p className="text-xs text-violet-400/70 line-clamp-2 leading-relaxed">
              {post.hashtags.map((h) => `#${h.replace(/^#/, "")}`).join(" ")}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={() => update.mutate({ postId: post.id, caption: editedCaption })}
                disabled={update.isPending}
                className="flex-1 text-xs py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors disabled:opacity-50"
              >
                {update.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => { setIsEditing(false); setEditedCaption(post.caption); }}
                className="flex-1 text-xs py-2 border border-[#1a2540] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-xl transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => approve.mutate({ postId: post.id })}
                disabled={approve.isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl transition-colors disabled:opacity-50"
              >
                <Check className="w-3 h-3" />
                {approve.isPending ? "Approving..." : "Approve"}
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-2 text-xs border border-[#1a2540] text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] rounded-xl transition-colors"
                title="Edit caption"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => reject.mutate({ postId: post.id })}
                disabled={reject.isPending}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors disabled:opacity-50"
              >
                <X className="w-3 h-3" />
                {reject.isPending ? "Rejecting..." : "Reject"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
