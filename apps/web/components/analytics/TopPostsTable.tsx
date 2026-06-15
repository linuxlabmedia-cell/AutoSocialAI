import Image from "next/image";

type PostAnalytic = {
  id: string;
  likes: number;
  comments: number;
  shares: number;
  post: { caption: string; postType: string; imageUrl?: string | null; publishedAt?: Date | null };
};

export function TopPostsTable({ posts, title }: { posts: PostAnalytic[]; title: string }) {
  return (
    <div className="rounded-xl border bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="divide-y">
        {posts.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No data yet</div>
        ) : (
          posts.map((a, i) => (
            <div key={a.id} className="flex items-center gap-3 p-3">
              <span className="text-sm font-bold text-muted-foreground w-4">{i + 1}</span>
              {a.post.imageUrl ? (
                <Image src={a.post.imageUrl} alt="" width={36} height={36} className="w-9 h-9 rounded object-cover shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded bg-muted shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate">{a.post.caption.slice(0, 60)}...</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {a.post.postType.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-semibold">{a.likes + a.comments + a.shares}</p>
                <p className="text-xs text-muted-foreground">engagements</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
