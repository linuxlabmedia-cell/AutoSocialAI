"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/trpc-provider";
import { Save, Loader2 } from "lucide-react";

interface ServiceCategoryFormProps {
  categoryId?: string;
  initialData?: {
    name: string;
    slug: string;
    description: string;
    contentStrategy: string;
    designRules: string;
    aiPromptFramework: string;
    isActive: boolean;
    sortOrder: number;
  };
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  hint,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  hint?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-400 mb-1.5">{label}{required && " *"}</label>
      {hint && <p className="text-xs text-slate-600 mb-2">{hint}</p>}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        required={required}
        className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 resize-y"
      />
    </div>
  );
}

export function ServiceCategoryForm({ categoryId, initialData }: ServiceCategoryFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [contentStrategy, setContentStrategy] = useState(initialData?.contentStrategy ?? "");
  const [designRules, setDesignRules] = useState(initialData?.designRules ?? "");
  const [aiPromptFramework, setAiPromptFramework] = useState(initialData?.aiPromptFramework ?? "");
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0);

  const createMutation = api.serviceCategories.create.useMutation({
    onSuccess: () => router.push("/admin/categories"),
  });
  const updateMutation = api.serviceCategories.update.useMutation({
    onSuccess: () => router.push("/admin/categories"),
  });

  const saving = createMutation.isPending || updateMutation.isPending;
  const error = createMutation.error?.message ?? updateMutation.error?.message;

  function autoSlug(val: string) {
    setName(val);
    if (!categoryId) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name, slug, description, contentStrategy, designRules, aiPromptFramework, isActive, sortOrder };
    if (categoryId) {
      updateMutation.mutate({ id: categoryId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-3xl">
      {error && (
        <div className="p-3 rounded-lg bg-rose-600/10 border border-rose-500/20 text-rose-400 text-sm">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">Basic Information</h3>
        </div>
        <div className="p-5 space-y-4 bg-[#0d1424]">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Category Name *</label>
            <input
              value={name}
              onChange={(e) => autoSlug(e.target.value)}
              placeholder="e.g. Website Design & Development"
              required
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Slug *</label>
            <p className="text-xs text-slate-600 mb-1.5">Lowercase, hyphens only — auto-generated from name</p>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. website-design"
              required
              pattern="^[a-z0-9-]+$"
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white font-mono placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this service category..."
              rows={2}
              required
              className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-violet-500/50 resize-y"
            />
          </div>
          <div className="grid grid-cols-2 gap-2 items-center">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Sort Order</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white focus:outline-none focus:border-violet-500/50"
              />
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isActive ? "bg-violet-600" : "bg-slate-700"}`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${isActive ? "translate-x-4" : "translate-x-1"}`} />
              </button>
              <span className="text-sm text-slate-400">{isActive ? "Active" : "Inactive"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">Content Strategy</h3>
        </div>
        <div className="p-5 bg-[#0d1424]">
          <TextArea
            label="Content Strategy"
            value={contentStrategy}
            onChange={setContentStrategy}
            placeholder="What is the overarching content strategy for this service? What should posts achieve?"
            rows={4}
            required
            hint="This context is loaded into the AI when generating content for this service category"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">Design Rules</h3>
        </div>
        <div className="p-5 bg-[#0d1424]">
          <TextArea
            label="Design Rules"
            value={designRules}
            onChange={setDesignRules}
            placeholder="What design rules apply to all templates in this category? e.g. 'Device mockups required. Clean modern layouts...'"
            rows={4}
            required
            hint="Design guidelines that apply to all templates in this service category"
          />
        </div>
      </div>

      <div className="rounded-xl border border-[#151f35] overflow-hidden">
        <div className="px-5 py-4 bg-[#0a0f1c]">
          <h3 className="text-sm font-semibold text-white">AI Prompt Framework</h3>
        </div>
        <div className="p-5 bg-[#0d1424]">
          <TextArea
            label="AI Prompt Framework"
            value={aiPromptFramework}
            onChange={setAiPromptFramework}
            placeholder="Default image generation prompt framework for templates in this category..."
            rows={6}
            required
            hint="This is the default prompt framework that templates in this category can inherit or customize. Templates can copy this as a starting point."
          />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !name || !slug}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : categoryId ? "Update Category" : "Create Category"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/categories")}
          className="text-slate-500 hover:text-slate-300 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
