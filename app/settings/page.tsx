"use client";

import { useState, useEffect, useRef } from "react";
import { getPromptData, savePromptData, clearPromptData, getDataStats } from "@/lib/dataStore";
import { isUnlocked } from "@/lib/auth";
import { navigateTo } from "@/lib/navigate";
import LockScreen from "@/components/LockScreen";

export default function SettingsPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [locked, setLocked] = useState(true);
  const [stats, setStats] = useState<{ types: number; categories: number; options: number } | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setLocked(!isUnlocked());
    setStats(getDataStats());
  }, []);

  if (locked) return <LockScreen onUnlocked={() => setLocked(false)} />;

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const result = savePromptData(text);
      if (result.ok) {
        setStats(getDataStats());
        setMessage({ type: "success", text: "导入成功" });
      } else {
        setMessage({ type: "error", text: result.error || "导入失败" });
      }
    } catch {
      setMessage({ type: "error", text: "文件读取失败" });
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleExport = () => {
    const data = getPromptData();
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompts.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    if (!confirm("确定清除所有提示词数据？此操作不可恢复。")) return;
    clearPromptData();
    setStats(null);
    setMessage({ type: "success", text: "数据已清除" });
  };

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
          <button
            onClick={() => navigateTo("/")}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-base font-semibold text-gray-900">设置</h1>
        </div>
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-8 space-y-6">
        {message && (
          <div
            className={`rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="float-right text-current opacity-50 hover:opacity-100 cursor-pointer"
            >
              &times;
            </button>
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <div>
            <h2 className="text-sm font-bold text-gray-800">提示词数据</h2>
            <p className="text-xs text-gray-400 mt-0.5">管理 prompts.json 数据文件</p>
          </div>

          {stats ? (
            <div className="rounded-lg bg-gray-50 p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-indigo-600">{stats.types}</p>
                <p className="text-xs text-gray-500">饰品类型</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">{stats.categories}</p>
                <p className="text-xs text-gray-500">维度分类</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-600">{stats.options}</p>
                <p className="text-xs text-gray-500">提示词选项</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
              <p className="text-sm text-amber-700 font-medium">尚未导入数据</p>
              <p className="text-xs text-amber-600 mt-1">请上传 prompts.json 文件以开始使用</p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <input
              ref={fileRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {stats ? "重新导入" : "导入 JSON"}
            </button>

            {stats && (
              <>
                <button
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                    border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  导出数据
                </button>
                <button
                  onClick={handleClear}
                  className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium
                    text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  清除数据
                </button>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
