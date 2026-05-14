"use client";

import { useRef, useState } from "react";
import { isElectronEnv } from "@/lib/electronAPI";

interface Props {
  onSave: (data: { name: string; prompt_zh: string; prompt_en: string; imageFile?: File }) => void;
}

export default function AddPresetForm({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [promptZh, setPromptZh] = useState("");
  const [promptEn, setPromptEn] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = name.trim() && promptZh.trim();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview(url);
  };

  const clearImage = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      name: name.trim(),
      prompt_zh: promptZh.trim(),
      prompt_en: promptEn.trim(),
      imageFile: imageFile ?? undefined,
    });
    setName("");
    setPromptZh("");
    setPromptEn("");
    clearImage();
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300
          py-4 text-sm text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer
          flex items-center justify-center gap-2"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        添加自定义预设
      </button>
    );
  }

  return (
    <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-gray-800">新建预设</h4>
        <button
          onClick={() => { clearImage(); setOpen(false); }}
          className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          取消
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">预设名称</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：跨境欧洲风格"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">中文提示词</label>
          <textarea
            value={promptZh}
            onChange={(e) => setPromptZh(e.target.value)}
            rows={4}
            placeholder="输入中文提示词..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
              resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            英文提示词 <span className="text-gray-400 font-normal">（选填）</span>
          </label>
          <textarea
            value={promptEn}
            onChange={(e) => setPromptEn(e.target.value)}
            rows={4}
            placeholder="Enter English prompt..."
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm
              resize-y focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>

        {isElectronEnv() && (
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              参考图片 <span className="text-gray-400 font-normal">（选填）</span>
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="预览"
                  className="h-32 rounded-lg object-cover border border-gray-200"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white
                    flex items-center justify-center text-xs cursor-pointer hover:bg-red-600"
                >
                  &times;
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg border border-dashed border-gray-300 hover:border-indigo-300
                  px-4 py-3 text-xs text-gray-400 hover:text-indigo-500 transition-colors cursor-pointer
                  flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
                选择图片
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full rounded-lg py-2 text-sm font-medium transition-colors cursor-pointer
          ${canSubmit
            ? "bg-indigo-600 text-white hover:bg-indigo-700"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
      >
        保存预设
      </button>
    </div>
  );
}
