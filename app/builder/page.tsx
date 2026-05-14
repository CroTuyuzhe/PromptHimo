"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { PromptDatabase, Selections, CustomPreset } from "@/lib/types";
import { assemblePrompt } from "@/lib/promptEngine";
import { getPromptData } from "@/lib/dataStore";
import { isUnlocked } from "@/lib/auth";
import { navigateTo } from "@/lib/navigate";
import { getCustomPresets, saveCustomPreset, deleteCustomPreset } from "@/lib/customPresets";
import { getElectronAPI } from "@/lib/electronAPI";
import LockScreen from "@/components/LockScreen";
import PhotoModeSelector from "@/components/PhotoModeSelector";
import CategorySection from "@/components/CategorySection";
import PromptOutput from "@/components/PromptOutput";
import PresetCard from "@/components/PresetCard";
import AddPresetForm from "@/components/AddPresetForm";

export default function BuilderPage() {
  const [jewelryType, setJewelryType] = useState("necklace");
  const [locked, setLocked] = useState(true);
  const [data, setData] = useState<PromptDatabase | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setJewelryType(params.get("type") || "necklace");
    setLocked(!isUnlocked());
    setData(getPromptData());
    setLoading(false);
  }, []);

  const [tab, setTab] = useState<"preset" | "custom">("custom");
  const [photoMode, setPhotoMode] = useState("model");
  const [selections, setSelections] = useState<Selections>({});
  const [customVer, setCustomVer] = useState(0);

  const userPresets = useMemo(
    () => getCustomPresets(jewelryType),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [jewelryType, customVer]
  );

  const handleAddPreset = useCallback(
    async (form: { name: string; prompt_zh: string; prompt_en: string; imageFile?: File }) => {
      const id = `custom_${Date.now()}`;
      let referenceImage: string | undefined;

      if (form.imageFile) {
        const api = getElectronAPI();
        if (api) {
          const ext = form.imageFile.name.split(".").pop() || "jpg";
          const filename = `${id}.${ext}`;
          const buffer = await form.imageFile.arrayBuffer();
          await api.saveImage(buffer, filename);
          referenceImage = filename;
        }
      }

      const preset: CustomPreset = {
        id,
        name: form.name,
        jewelryType,
        prompt_zh: form.prompt_zh,
        prompt_en: form.prompt_en,
        referenceImage,
      };
      saveCustomPreset(preset);
      setCustomVer((v) => v + 1);
    },
    [jewelryType]
  );

  const handleDeletePreset = useCallback(async (id: string) => {
    await deleteCustomPreset(id);
    setCustomVer((v) => v + 1);
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    );
  }

  if (locked) return <LockScreen onUnlocked={() => { setLocked(false); setData(getPromptData()); }} />;

  if (!data) {
    navigateTo("/settings");
    return null;
  }

  const jewelryLabel =
    data.jewelryTypes.find((t) => t.id === jewelryType)?.label || "饰品";

  const basePrompt = data.basePrompts[photoMode]?.[jewelryType];

  const visibleCategories = data.categories.filter(
    (c) =>
      c.jewelryTypes.includes(jewelryType) &&
      c.photoModes.includes(photoMode)
  );

  const handleModeChange = (mode: string) => {
    setPhotoMode(mode);
    setSelections({});
  };

  const handleToggle = (categoryId: string, optionId: string) => {
    setSelections((prev) => {
      const current = prev[categoryId] || [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [categoryId]: next };
    });
  };

  const handleReset = () => setSelections({});

  const promptZh = assemblePrompt(data.categories, selections, jewelryType, photoMode, basePrompt, "zh");
  const promptEn = assemblePrompt(data.categories, selections, jewelryType, photoMode, basePrompt, "en");

  const hasSelections = Object.values(selections).some((v) => v.length > 0);

  const filteredPresets = (data.presets || []).filter(
    (p) => p.jewelryType === jewelryType
  );

  return (
    <div className="flex-1 flex flex-col">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo("/")}
              className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-base font-semibold text-gray-900 flex items-center gap-1.5">
              <span className="text-gray-400">{jewelryLabel}</span>
              <span className="text-gray-300">/</span>
              <span>提示词工具</span>
            </h1>
          </div>
          {tab === "custom" && hasSelections && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
            >
              重置选择
            </button>
          )}
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-1 border-b border-gray-100">
            <button
              onClick={() => setTab("preset")}
              className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer relative ${
                tab === "preset"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              快捷预设
              {(filteredPresets.length + userPresets.length) > 0 && (
                <span className="ml-1.5 text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-full">
                  {filteredPresets.length + userPresets.length}
                </span>
              )}
              {tab === "preset" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setTab("custom")}
              className={`px-4 py-2.5 text-sm font-medium transition-colors cursor-pointer relative ${
                tab === "custom"
                  ? "text-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              自定义组装
              {tab === "custom" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-6">
        {tab === "preset" ? (
          <div className="max-w-3xl space-y-4">
            {filteredPresets.length > 0 && (
              filteredPresets.map((preset) => (
                <PresetCard
                  key={preset.id}
                  preset={preset}
                  photoModeLabel={
                    data.photoModes.find((m) => m.id === preset.photoMode)?.label || preset.photoMode
                  }
                />
              ))
            )}

            {userPresets.length > 0 && (
              <>
                <div className="flex items-center gap-3 pt-2">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-gray-400 shrink-0">我的预设</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>
                {userPresets.map((preset) => (
                  <PresetCard
                    key={preset.id}
                    preset={preset}
                    onDelete={() => handleDeletePreset(preset.id)}
                  />
                ))}
              </>
            )}

            {filteredPresets.length === 0 && userPresets.length === 0 && (
              <p className="text-gray-400 text-center py-8">
                暂无预设，点击下方添加
              </p>
            )}

            <AddPresetForm onSave={handleAddPreset} />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <PhotoModeSelector
                modes={data.photoModes}
                selected={photoMode}
                onSelect={handleModeChange}
              />
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 space-y-3">
                {visibleCategories.map((category) => (
                  <CategorySection
                    key={category.id}
                    category={category}
                    jewelryType={jewelryType}
                    selectedIds={selections[category.id] || []}
                    onToggle={handleToggle}
                  />
                ))}

                {visibleCategories.length === 0 && (
                  <p className="text-gray-400 text-center py-12">
                    暂无该模式的提示词选项，敬请期待
                  </p>
                )}
              </div>

              <div className="lg:w-[420px] lg:sticky lg:top-24 lg:self-start">
                <PromptOutput
                  baseZh={basePrompt?.zh || ""}
                  baseEn={basePrompt?.en || ""}
                  promptZh={promptZh}
                  promptEn={promptEn}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
