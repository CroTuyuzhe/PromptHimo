"use client";

interface Props {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function OptionChip({ label, selected, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center rounded-lg px-3 py-1.5 text-[13px]
        transition-all duration-150 cursor-pointer border
        ${
          selected
            ? "bg-indigo-50 text-indigo-700 border-indigo-400 font-semibold"
            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
        }
      `}
    >
      {selected && (
        <svg className="mr-1 h-3 w-3 text-indigo-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      {label}
    </button>
  );
}
