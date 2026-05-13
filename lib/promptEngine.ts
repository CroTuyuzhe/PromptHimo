import { Category, LangPair, Selections } from "./types";

export function assemblePrompt(
  categories: Category[],
  selections: Selections,
  jewelryType: string,
  photoMode: string,
  basePrompt: LangPair | undefined,
  lang: "zh" | "en"
): string {
  const parts: string[] = [];

  if (basePrompt) {
    parts.push(lang === "zh" ? basePrompt.zh : basePrompt.en);
  }

  for (const category of categories) {
    if (!category.jewelryTypes.includes(jewelryType)) continue;
    if (!category.photoModes.includes(photoMode)) continue;

    const selectedIds = selections[category.id];
    if (!selectedIds || selectedIds.length === 0) continue;

    const prompts = selectedIds
      .map((id) => {
        const option = category.options.find(
          (o) => o.id === id && (!o.jewelryTypes || o.jewelryTypes.includes(jewelryType))
        );
        return option ? (lang === "zh" ? option.prompt_zh : option.prompt_en) : null;
      })
      .filter(Boolean);

    if (prompts.length > 0) {
      parts.push(prompts.join(lang === "zh" ? "，" : ", "));
    }
  }

  if (parts.length === 0) return "";

  return lang === "zh"
    ? parts.join("，\n")
    : parts.join(",\n");
}
