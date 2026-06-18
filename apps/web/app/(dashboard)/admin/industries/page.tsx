import Link from "next/link";
import { Plus, ArrowLeft } from "lucide-react";
import { IndustriesManager } from "@/components/admin/IndustriesManager";

export default function IndustriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            Admin Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-white">Industry Database</h1>
          <p className="text-slate-500 mt-1 text-sm">
            Manage the 30 supported industries — tones, visual styles, keywords, and compatible services
          </p>
        </div>
        <Link
          href="/admin/industries/new"
          className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Industry
        </Link>
      </div>
      <IndustriesManager />
    </div>
  );
}
