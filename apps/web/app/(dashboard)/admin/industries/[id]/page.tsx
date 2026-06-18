import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { IndustryEditLoader } from "@/components/admin/IndustryEditLoader";

export default function EditIndustryPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/industries"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Industries
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Industry</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Update industry profile, tone, visual style, and compatible service categories
        </p>
      </div>
      <IndustryEditLoader industryId={params.id} />
    </div>
  );
}
