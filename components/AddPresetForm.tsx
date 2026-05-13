"use client";

import { useState } from "react";

interface Props {
  onSave: (data: { name: string; prompt_zh: string; prompt_en: string }) => void;
}

export default function AddPresetForm({ onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [promptZh, setPromptZh] = useState("");
  const [promptEn, setPromptEn] = useState("");

  const canSubmit = name.trim() && promptZh.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({ name: name.trim(), prompt_zh: promptZh.trim(), prompt_en: promptEn.trim() });
    setName("");
    setPromptZh("");
    setPromptEn("");
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
          onClick={() => setOpen(false)}
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
