import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceCategoryForm } from "@/components/admin/ServiceCategoryForm";

export default function NewServiceCategoryPage() {
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
        <h1 className="text-2xl font-bold text-white">Add Service Category</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Create a new service category with content strategy, design rules, and AI prompt framework
        </p>
      </div>
      <ServiceCategoryForm />
    </div>
  );
}
