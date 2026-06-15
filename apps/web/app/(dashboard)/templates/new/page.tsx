import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TemplateForm } from "@/components/templates/TemplateForm";

export default function NewTemplatePage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/templates"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Templates
        </Link>
        <h1 className="text-2xl font-bold text-white">New Template</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Define a reusable creative framework for AI content generation
        </p>
      </div>
      <TemplateForm />
    </div>
  );
}
