"use client";

import { api } from "@/lib/trpc-provider";
import { ServiceCategoryForm } from "./ServiceCategoryForm";
import { Loader2 } from "lucide-react";

export function ServiceCategoryEditLoader({ categoryId }: { categoryId: string }) {
  const { data, isLoading } = api.serviceCategories.get.useQuery({ id: categoryId });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-slate-500">Category not found.</p>;

  return (
    <ServiceCategoryForm
      categoryId={data.id}
      initialData={{
        name: data.name,
        slug: data.slug,
        description: data.description,
        contentStrategy: data.contentStrategy,
        designRules: data.designRules,
        aiPromptFramework: data.aiPromptFramework,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }}
    />
  );
}
