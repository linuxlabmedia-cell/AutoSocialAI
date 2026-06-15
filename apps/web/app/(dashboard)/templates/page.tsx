import Link from "next/link";
import { Plus } from "lucide-react";
import { TemplateList } from "@/components/templates/TemplateList";

export default function TemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Creative Template Library</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Build and manage reusable creative frameworks for AI content generation
          </p>
        </div>
        <Link
          href="/templates/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Template
        </Link>
      </div>
      <TemplateList />
    </div>
  );
}
