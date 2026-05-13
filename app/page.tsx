"use client";

import { PromptDatabase } from "@/lib/types";
import { isUnlocked } from "@/lib/auth";
import { getPromptData } from "@/lib/dataStore";
import { navigateTo } from "@/lib/navigate";
import LockScreen from "@/components/LockScreen";
import JewelryTypeSelector from "@/components/JewelryTypeSelector";
import { useState, useEffect } from "react";

export default function Home() {
  const [locked, setLocked] = useState(true);
  const [data, setData] = useState<PromptDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setLocked(!isUnlocked());
    setData(getPromptData());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">加载中...</p>
      </main>
    );
  }

  if (locked) return <LockScreen onUnlocked={() => { setLocked(false); setData(getPromptData()); }} />;

  const handleNext = () => {
    if (selected) {
      navigateTo(`/builder?type=${selected}`);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg space-y-10">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
                  <path d="M12 2L15.5 8.5L22 12L15.5 15.5L12 22L8.5 15.5L2 12L8.5 8.5L12 2Z" fill="currentColor" opacity="0.9" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Prompt{" "}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Himo
                </span>
              </h1>
            </div>
            <p className="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
              饰品产品图 AI 提示词工具，选择类型开始组装
            </p>
          </div>

          {data ? (
            <>
              <div>
                <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3 text-center">
                  选择饰品类型
                </p>
                <JewelryTypeSelector
                  types={data.jewelryTypes}
                  selected={selected}
                  onSelect={setSelected}
                />
              </div>

              <button
                onClick={handleNext}
                disabled={!selected}
                className={`
                  w-full rounded-xl py-3.5 text-sm font-semibold tracking-wide transition-all duration-200
                  ${
                    selected
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 cursor-pointer shadow-lg shadow-indigo-200/50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }
                `}
              >
                开始组装
                <svg className="inline-block ml-1.5 h-4 w-4 -mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-6">
                <svg className="h-8 w-8 text-amber-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p className="text-sm font-medium text-amber-800">尚未导入提示词数据</p>
                <p className="text-xs text-amber-600 mt-1">请前往设置页导入 prompts.json 文件</p>
              </div>
              <button
                onClick={() => navigateTo("/settings")}
                className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold
                  bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90
                  transition-opacity cursor-pointer shadow-lg shadow-indigo-200/50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                前往设置
              </button>
            </div>
          )}
        </div>
      </div>

      <footer className="flex items-center justify-between px-6 py-4">
        <p className="text-xs text-gray-300">Prompt Himo &middot; Jewelry Product Photo Prompt Builder</p>
        <button
          onClick={() => navigateTo("/settings")}
          className="text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
        >
          <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </footer>
    </main>
  );
}
