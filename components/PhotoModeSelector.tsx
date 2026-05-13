"use client";

import { PhotoMode } from "@/lib/types";

interface Props {
  modes: PhotoMode[];
  selected: string;
  onSelect: (id: string) => void;
}

export default function PhotoModeSelector({ modes, selected, onSelect }: Props) {
  return (
    <div className="flex gap-3">
      {modes.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onSelect(mode.id)}
          className={`
            flex-1 flex items-center gap-3 rounded-xl border-2 px-4 py-3
            transition-all duration-200 cursor-pointer text-left
            ${
              selected === mode.id
                ? "border-indigo-500 bg-indigo-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }
          `}
        >
          <span className="text-2xl">{mode.icon}</span>
          <div>
            <div className={`text-sm font-semibold ${selected === mode.id ? "text-indigo-700" : "text-gray-800"}`}>
              {mode.label}
            </div>
            <div className="text-xs text-gray-500">{mode.description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
