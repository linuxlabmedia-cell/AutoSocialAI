import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceCategoryEditLoader } from "@/components/admin/ServiceCategoryEditLoader";

export default function EditServiceCategoryPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <h1 className="text-2xl font-bold text-white">Edit Service Category</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Update content strategy, design rules, and AI prompt framework
        </p>
      </div>
      <ServiceCategoryEditLoader categoryId={params.id} />
    </div>
  );
}
