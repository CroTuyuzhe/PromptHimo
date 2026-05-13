"use client";

import { useState } from "react";

interface Props {
  baseZh: string;
  baseEn: string;
  promptZh: string;
  promptEn: string;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      disabled={!text}
      className={`
        inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium
        transition-all duration-150 cursor-pointer shrink-0
        ${
          !text
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : copied
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

function PromptBlock({
  title,
  baseText,
  fullText,
  copyLabel,
  placeholder,
}: {
  title: string;
  baseText: string;
  fullText: string;
  copyLabel: string;
  placeholder: string;
}) {
  const hasExtra = fullText.length > baseText.length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="text-sm font-semibold text-gray-500">{title}</h4>
        <CopyButton text={fullText} label={copyLabel} />
      </div>
      {fullText ? (
        <div className="text-sm leading-relaxed text-gray-800 whitespace-pre-wrap">
          <span className="text-indigo-600">{baseText}</span>
          {hasExtra && (
            <span>{fullText.slice(baseText.length)}</span>
          )}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic min-h-[2rem]">{placeholder}</p>
      )}
    </div>
  );
}

export default function PromptOutput({ baseZh, baseEn, promptZh, promptEn }: Props) {
  return (
    <div className="space-y-3">
      <PromptBlock
        title="中文提示词"
        baseText={baseZh}
        fullText={promptZh}
        copyLabel="复制中文"
        placeholder="请在左侧选择选项后生成提示词..."
      />
      <PromptBlock
        title="English Prompt"
        baseText={baseEn}
        fullText={promptEn}
        copyLabel="Copy EN"
        placeholder="Select options to generate prompt..."
      />
    </div>
  );
}
