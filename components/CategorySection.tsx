"use client";

import { Category } from "@/lib/types";
import OptionChip from "./OptionChip";

interface Props {
  category: Category;
  jewelryType: string;
  selectedIds: string[];
  onToggle: (categoryId: string, optionId: string) => void;
}

export default function CategorySection({ category, jewelryType, selectedIds, onToggle }: Props) {
  const visibleOptions = category.options.filter(
    (o) => !o.jewelryTypes || o.jewelryTypes.includes(jewelryType)
  );

  if (visibleOptions.length === 0) return null;

  const selectedCount = visibleOptions.filter((o) => selectedIds.includes(o.id)).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-5 rounded-full bg-indigo-500" />
        <h3 className="text-sm font-bold text-gray-800">
          {category.label}
        </h3>
        {selectedCount > 0 && (
          <span className="ml-auto text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full font-medium">
            已选 {selectedCount}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleOptions.map((option) => (
          <OptionChip
            key={option.id}
            label={option.label}
            selected={selectedIds.includes(option.id)}
            onClick={() => onToggle(category.id, option.id)}
          />
        ))}
      </div>
    </div>
  );
}
