import Image from "next/image";
import { Trophy } from "lucide-react";

type PostAnalytic = {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  post: { caption: string; postType: string; imageUrl?: string | null; publishedAt?: Date | null };
};

export function TopPostsTable({ posts, title }: { posts: PostAnalytic[]; title: string }) {
  return (
    <div className="rounded-2xl border border-[#151f35] bg-[#0d1526] overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-4 border-b border-[#151f35]">
        <Trophy className="w-4 h-4 text-amber-400" />
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      <div className="divide-y divide-[#0f1a2e]">
        {posts.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-600">No data yet</div>
        ) : (
          posts.map((a, i) => (
            <div key={a.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
              <span className="text-sm font-bold text-slate-600 w-4 shrink-0">{i + 1}</span>
              {a.post.imageUrl ? (
                <Image src={a.post.imageUrl} alt="" width={36} height={36} className="w-9 h-9 rounded-xl object-cover shrink-0 border border-[#1a2540]" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/10 border border-violet-500/20 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 truncate">{a.post.caption.slice(0, 60)}...</p>
                <p className="text-xs text-slate-600 capitalize">
                  {a.post.postType.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold text-white tabular-nums">{a.likes + a.comments + a.shares}</p>
                <p className="text-xs text-slate-600">engagements</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
