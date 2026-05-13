"use client";

import { JewelryType } from "@/lib/types";

const jewelryIcons: Record<string, React.ReactNode> = {
  necklace: (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
      <path d="M12 8C12 8 10 18 10 24C10 30 14 36 24 36C34 36 38 30 38 24C38 18 36 8 36 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="36" r="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
      <path d="M20 36L24 42L28 36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  bracelet: (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
      <ellipse cx="24" cy="26" rx="14" ry="12" stroke="currentColor" strokeWidth="2.5" />
      <ellipse cx="24" cy="26" rx="10" ry="8" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="24" cy="14" r="3" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2" />
      <circle cx="14" cy="20" r="2" fill="currentColor" opacity="0.15" />
      <circle cx="34" cy="20" r="2" fill="currentColor" opacity="0.15" />
    </svg>
  ),
  earring: (
    <svg viewBox="0 0 48 48" fill="none" className="h-10 w-10">
      <path d="M24 6V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="6" r="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M24 12L18 22L24 42L30 22L24 12Z" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M21 24L24 32L27 24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
    </svg>
  ),
};

interface Props {
  types: JewelryType[];
  selected: string | null;
  onSelect: (id: string) => void;
}

export default function JewelryTypeSelector({ types, selected, onSelect }: Props) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {types.map((type) => {
        const isActive = selected === type.id;
        return (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`
              group relative flex flex-col items-center gap-3 rounded-2xl border p-6
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "border-indigo-400 bg-indigo-50/80 shadow-lg shadow-indigo-100/60 ring-1 ring-indigo-400/30"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
              }
            `}
          >
            <div
              className={`transition-colors duration-200 ${
                isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"
              }`}
            >
              {jewelryIcons[type.id] || <div className="h-10 w-10" />}
            </div>
            <span
              className={`text-sm font-semibold tracking-wide ${
                isActive ? "text-indigo-700" : "text-gray-600"
              }`}
            >
              {type.label}
            </span>
            {isActive && (
              <div className="absolute top-2.5 right-2.5 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
