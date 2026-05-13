export interface PromptOption {
  id: string;
  label: string;
  prompt_zh: string;
  prompt_en: string;
  jewelryTypes?: string[];
}

export interface Category {
  id: string;
  label: string;
  photoModes: string[];
  jewelryTypes: string[];
  options: PromptOption[];
}

export interface JewelryType {
  id: string;
  label: string;
  icon: string;
}

export interface PhotoMode {
  id: string;
  label: string;
  icon: string;
  description: string;
}

export interface LangPair {
  zh: string;
  en: string;
}

export interface Preset {
  id: string;
  name: string;
  description: string;
  jewelryType: string;
  photoMode: string;
  prompt_zh: string;
  prompt_en: string;
}

export interface PromptDatabase {
  jewelryTypes: JewelryType[];
  photoModes: PhotoMode[];
  basePrompts: Record<string, Record<string, LangPair>>;
  presets: Preset[];
  categories: Category[];
}

export interface CustomPreset {
  id: string;
  name: string;
  jewelryType: string;
  prompt_zh: string;
  prompt_en: string;
}

export type Selections = Record<string, string[]>;
