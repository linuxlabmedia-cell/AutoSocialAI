import Link from "next/link";
import { Globe, Layers, LayoutTemplate, Database, ArrowRight } from "lucide-react";

const adminSections = [
  {
    href: "/admin/categories",
    icon: Layers,
    title: "Service Categories",
    description: "Manage the 8 LinuxLab Media service offerings. Edit content strategies, design rules, and AI prompt frameworks.",
    color: "from-violet-600/20 to-indigo-600/10",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    href: "/admin/industries",
    icon: Globe,
    title: "Industries",
    description: "Manage the 30 supported industry profiles. Edit tones, visual styles, keywords, and compatible services.",
    color: "from-blue-600/20 to-cyan-600/10",
    border: "border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    href: "/templates",
    icon: LayoutTemplate,
    title: "Template Library",
    description: "Create, edit, duplicate, and manage the 64 creative templates. Assign service categories and industries.",
    color: "from-emerald-600/20 to-teal-600/10",
    border: "border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage the Template Management System — industries, service categories, and creative templates
        </p>
      </div>

      {/* System overview cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-[#0d1424] border border-[#151f35] p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Industries</p>
          <p className="text-2xl font-bold text-white">30</p>
          <p className="text-xs text-slate-600 mt-1">Supported industries</p>
        </div>
        <div className="rounded-xl bg-[#0d1424] border border-[#151f35] p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Services</p>
          <p className="text-2xl font-bold text-white">8</p>
          <p className="text-xs text-slate-600 mt-1">LinuxLab Media services</p>
        </div>
        <div className="rounded-xl bg-[#0d1424] border border-[#151f35] p-4">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Templates</p>
          <p className="text-2xl font-bold text-white">64</p>
          <p className="text-xs text-slate-600 mt-1">Creative templates available</p>
        </div>
      </div>

      {/* Admin sections */}
      <div className="grid grid-cols-1 gap-4">
        {adminSections.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`group flex items-center gap-5 p-5 rounded-xl bg-gradient-to-r ${section.color} border ${section.border} hover:border-opacity-60 transition-all duration-200`}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                <Icon className={`w-6 h-6 ${section.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white">{section.title}</h3>
                <p className="text-slate-400 text-sm mt-0.5">{section.description}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-600 group-hover:text-slate-400 group-hover:translate-x-1 transition-all shrink-0" />
            </Link>
          );
        })}
      </div>

      {/* System info */}
      <div className="rounded-xl bg-[#0d1424] border border-[#151f35] p-5">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-400">Template System Architecture</h3>
        </div>
        <div className="space-y-2 text-xs text-slate-500">
          <p><span className="text-slate-300 font-medium">Industry</span> → Defines tone, visual style, keywords, and recommended CTAs for each of the 30 supported industries</p>
          <p><span className="text-slate-300 font-medium">Service Category</span> → Defines content strategy, design rules, and AI prompt framework for each of LinuxLab Media&apos;s 8 service offerings</p>
          <p><span className="text-slate-300 font-medium">Template</span> → Specific creative template with full AI instructions, assigned to one service category and multiple compatible industries</p>
          <p><span className="text-slate-300 font-medium">AI Generation</span> → When generating content, the system loads the client&apos;s industry profile + active service categories from approved templates to enrich the Claude prompt</p>
        </div>
      </div>
    </div>
  );
}
