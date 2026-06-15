"use client";

import { useState, useRef } from "react";
import { api } from "@/lib/trpc-provider";
import {
  Upload,
  Trash2,
  Star,
  Image as ImageIcon,
  FileText,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";

const ASSET_TYPES = [
  { value: "LOGO", label: "Primary Logo" },
  { value: "SECONDARY_LOGO", label: "Secondary Logo" },
  { value: "BRAND_PHOTO", label: "Brand Photo" },
  { value: "TEAM_PHOTO", label: "Team Photo" },
  { value: "PROPERTY_PHOTO", label: "Property Photo" },
  { value: "STOCK_PHOTO", label: "Stock Photo" },
  { value: "EXAMPLE_POST", label: "Example Post" },
  { value: "COMPETITOR_GRAPHIC", label: "Competitor Graphic" },
  { value: "BRAND_GUIDELINE", label: "Brand Guideline" },
];

function AssetTypeSection({
  type,
  label,
  assets,
  clientId,
  onRefetch,
}: {
  type: string;
  label: string;
  assets: any[];
  clientId: string;
  onRefetch: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState(type);
  const [assetName, setAssetName] = useState("");
  const [notes, setNotes] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");

  const createMutation = api.assets.create.useMutation({
    onSuccess: () => {
      onRefetch();
      setShowAdd(false);
      setPendingUrl("");
      setAssetName("");
      setNotes("");
      toast.success("Asset added");
    },
  });
  const deleteMutation = api.assets.delete.useMutation({ onSuccess: onRefetch });
  const setPrimaryMutation = api.assets.setPrimary.useMutation({ onSuccess: onRefetch });

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        setPendingUrl(data.url);
        setAssetName(assetName || file.name.replace(/\.[^.]+$/, ""));
        setShowAdd(true);
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function handleSave() {
    if (!pendingUrl && !assetName) return;
    createMutation.mutate({
      clientId,
      type: selectedType,
      name: assetName || label,
      url: pendingUrl,
      isPrimary: assets.length === 0,
      notes: notes || undefined,
    });
  }

  const isImage = (url: string) =>
    url.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(url);

  return (
    <div className="border border-[#151f35] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-[#0a0f1c]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="text-xs text-slate-600">({assets.length})</span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5" />
          )}
          Upload
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleUpload}
          className="hidden"
        />
      </div>

      {/* Upload dialog */}
      {showAdd && (
        <div className="p-4 bg-[#0d1424] border-b border-[#151f35] space-y-3">
          {pendingUrl && isImage(pendingUrl) && (
            <img
              src={pendingUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border border-[#151f35]"
            />
          )}
          <input
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
            placeholder="Asset name..."
            className="w-full px-3 py-2 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none"
          />
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)..."
            className="w-full px-3 py-2 bg-[#06090f] border border-[#151f35] rounded-lg text-sm text-white placeholder:text-slate-700 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={createMutation.isPending}
              className="flex items-center gap-1.5 text-xs bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
              Save Asset
            </button>
            <button
              onClick={() => { setShowAdd(false); setPendingUrl(""); }}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Asset grid */}
      {assets.length > 0 ? (
        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`relative group rounded-lg border overflow-hidden ${
                asset.isPrimary ? "border-violet-500/40" : "border-[#151f35]"
              }`}
            >
              {isImage(asset.url) ? (
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-24 object-cover bg-[#06090f]"
                />
              ) : (
                <div className="w-full h-24 bg-[#06090f] flex items-center justify-center">
                  <FileText className="w-8 h-8 text-slate-600" />
                </div>
              )}
              <div className="p-2 bg-[#0d1424]">
                <p className="text-xs text-slate-400 truncate">{asset.name}</p>
                {asset.isPrimary && (
                  <span className="text-xs text-violet-400 font-medium">Primary</span>
                )}
              </div>
              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {!asset.isPrimary && (
                  <button
                    onClick={() => setPrimaryMutation.mutate({ assetId: asset.id, clientId })}
                    className="p-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white"
                    title="Set as primary"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm("Delete this asset?")) {
                      deleteMutation.mutate({ assetId: asset.id, clientId });
                    }
                  }}
                  className="p-1.5 bg-rose-600/80 hover:bg-rose-600 rounded-lg text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <ImageIcon className="w-6 h-6 text-slate-700 mx-auto mb-2" />
          <p className="text-xs text-slate-600">No {label.toLowerCase()} uploaded yet</p>
        </div>
      )}
    </div>
  );
}

export function ClientAssets({ clientId }: { clientId: string }) {
  const { data: assets, isLoading, refetch } = api.assets.list.useQuery({ clientId });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-xl bg-[#0d1424] border border-[#151f35] animate-pulse" />
        ))}
      </div>
    );
  }

  const groupedAssets = ASSET_TYPES.reduce<Record<string, any[]>>((acc, type) => {
    acc[type.value] = (assets ?? []).filter((a) => a.type === type.value);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white">Client Assets</h2>
        <p className="text-slate-500 text-sm mt-1">
          Upload logos, photos, and brand materials. AI will reference these when generating content.
        </p>
      </div>
      {ASSET_TYPES.map((type) => (
        <AssetTypeSection
          key={type.value}
          type={type.value}
          label={type.label}
          assets={groupedAssets[type.value] ?? []}
          clientId={clientId}
          onRefetch={refetch}
        />
      ))}
    </div>
  );
}
