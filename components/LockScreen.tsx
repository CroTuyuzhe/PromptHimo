"use client";

import { useState } from "react";
import { unlock } from "@/lib/auth";

interface Props {
  onUnlocked: () => void;
}

export default function LockScreen({ onUnlocked }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlock(password)) {
      onUnlocked();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm px-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-200/50 mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7 text-white">
              <path d="M12 2L15.5 8.5L22 12L15.5 15.5L12 22L8.5 15.5L2 12L8.5 8.5L12 2Z" fill="currentColor" opacity="0.9" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900">
            Prompt{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Himo
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">请输入管理员密码</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={shaking ? "animate-shake" : ""}>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="输入密码..."
              autoFocus
              className={`
                w-full rounded-xl border px-4 py-3 text-sm text-center tracking-widest
                focus:outline-none focus:ring-2 transition-colors
                ${error
                  ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                  : "border-gray-200 focus:ring-indigo-200 focus:border-indigo-400"
                }
              `}
            />
            {error && (
              <p className="text-xs text-red-500 text-center mt-2">密码错误，请重试</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-xl py-3 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            解锁
          </button>
        </form>
      </div>
    </div>
  );
}
