"use client";

import { useState } from "react";
import { getPresetImageUrl } from "@/lib/electronAPI";

interface PresetLike {
  id: string;
  name: string;
  description?: string;
  prompt_zh: string;
  prompt_en: string;
  referenceImage?: string;
}

interface Props {
  preset: PresetLike;
  photoModeLabel?: string;
  onDelete?: () => void;
}

function CopyBtn({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
        transition-all duration-150 cursor-pointer shrink-0
        ${copied
          ? "bg-green-500 text-white"
          : "bg-indigo-600 text-white hover:bg-indigo-700"
        }
      `}
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          已复制
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {label}
        </>
      )}
    </button>
  );
}

export default function PresetCard({ preset, photoModeLabel, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900">{preset.name}</h3>
          {(photoModeLabel || preset.description) && (
            <p className="text-xs text-gray-500 mt-0.5">
              {photoModeLabel}
              {photoModeLabel && preset.description && " · "}
              {preset.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          {preset.referenceImage && (() => {
            const src = getPresetImageUrl(preset.referenceImage);
            return src ? (
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                <img
                  src={src}
                  alt="参考图"
                  className="w-full h-full object-contain"
                  onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none"; }}
                />
              </div>
            ) : null;
          })()}
          <div className="flex flex-col items-end gap-1">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer"
            >
              {expanded ? "收起" : "展开详情"}
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                删除
              </button>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="space-y-3 pt-1">
          <div className="rounded-lg bg-gray-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">中文提示词</span>
              <CopyBtn text={preset.prompt_zh} label="复制中文" />
            </div>
            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{preset.prompt_zh}</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">English Prompt</span>
              <CopyBtn text={preset.prompt_en} label="Copy EN" />
            </div>
            <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">{preset.prompt_en}</p>
          </div>
        </div>
      )}

      {!expanded && (
        <div className="flex gap-2">
          <CopyBtn text={preset.prompt_zh} label="复制中文" />
          <CopyBtn text={preset.prompt_en} label="Copy EN" />
        </div>
      )}
    </div>
  );
}
