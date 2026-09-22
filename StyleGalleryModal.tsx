import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  Palette,
  Image as ImageIcon,
  Check,
  Upload,
  Eye,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { PointTableStyleConfig, PointTableRowData, TableStyleTheme } from '../types';
import { AVAILABLE_TABLE_STYLES, GALLERY_BACKGROUND_PRESETS, getPlacementPoints } from "./tournamentUtils"

interface StyleGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStyle?: PointTableStyleConfig;
  onApplyStyle: (style: PointTableStyleConfig) => void;
  previewRows?: PointTableRowData[];
  gameName?: string;
  matchTitle?: string;
}

export const StyleGalleryModal: React.FC<StyleGalleryModalProps> = ({
  isOpen,
  onClose,
  currentStyle,
  onApplyStyle,
  previewRows = [
    { id: '1', teamName: 'Team Soul', kills: 12, rank: 1 },
    { id: '2', teamName: 'GodLike Esports', kills: 8, rank: 2 },
    { id: '3', teamName: 'Orangutan Elite', kills: 6, rank: 3 },
  ],
  gameName = 'Free Fire',
  matchTitle = 'Grand Finals: Bermuda'
}) => {
  const [selectedTheme, setSelectedTheme] = useState<TableStyleTheme>(
    currentStyle?.themeId || 'titanium-dark'
  );
  const [customImage, setCustomImage] = useState<string | undefined>(
    currentStyle?.customBgImage
  );
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>(
    currentStyle?.primaryColor || '#10b981'
  );
  const [customAccentColor, setCustomAccentColor] = useState<string>(
    currentStyle?.accentColor || '#38bdf8'
  );
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload safely
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 3MB for background)
    if (file.size > 3 * 1024 * 1024) {
      setUploadError('Image size exceeds 3MB limit. Please select a smaller image.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file type. Please upload a PNG, JPG, or WebP image.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCustomImage(reader.result);
        setSelectedTheme('custom-gallery');
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Build active preview config
  const getActiveStyleConfig = (): PointTableStyleConfig => {
    if (selectedTheme === 'custom-gallery') {
      return {
        themeId: 'custom-gallery',
        name: 'Custom Wallpaper Theme',
        primaryColor: customPrimaryColor,
        accentColor: customAccentColor,
        headerBg: 'bg-slate-950/90 backdrop-blur-md',
        rowBg: 'bg-slate-900/75 backdrop-blur-sm',
        borderColor: 'border-slate-700/60',
        customBgImage: customImage,
        fontStyle: 'chakra'
      };
    }

    const matched = AVAILABLE_TABLE_STYLES.find((s) => s.themeId === selectedTheme);
    return matched || AVAILABLE_TABLE_STYLES[0];
  };

  const activeStyle = getActiveStyleConfig();

  const handleApply = () => {
    onApplyStyle(activeStyle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black text-white uppercase font-['Chakra_Petch'] tracking-wide flex items-center gap-2">
                Tournament Style Gallery
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  Customizer
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Select from professional esports themes or apply a custom gallery wallpaper.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Live Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                Live Design Preview
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Theme: <strong className="text-white">{activeStyle.name}</strong>
              </span>
            </div>

            <div
              className={`relative rounded-xl border ${activeStyle.borderColor} overflow-hidden p-4 transition-all duration-300 shadow-xl`}
              style={{
                backgroundColor: '#0a0f1d',
                backgroundImage: activeStyle.customBgImage
                  ? `linear-gradient(rgba(10, 15, 29, 0.82), rgba(10, 15, 29, 0.88)), url(${activeStyle.customBgImage})`
                  : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              {/* Header inside preview */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <div>
                  <h4
                    className="text-sm font-black uppercase tracking-wider font-['Chakra_Petch']"
                    style={{ color: activeStyle.primaryColor }}
                  >
                    {gameName} POINT TABLE
                  </h4>
                  <p className="text-[10px] text-slate-300 font-mono">{matchTitle}</p>
                </div>
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                  style={{
                    borderColor: `${activeStyle.primaryColor}55`,
                    color: activeStyle.primaryColor,
                    backgroundColor: `${activeStyle.primaryColor}15`
                  }}
                >
                  Fair Play Verified
                </span>
              </div>

              {/* Miniature table */}
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-[10px] uppercase text-slate-400 border-b border-white/10">
                    <th className="py-1.5 px-2">#</th>
                    <th className="py-1.5 px-2">Squad Name</th>
                    <th className="py-1.5 px-2 text-center">Place Pts</th>
                    <th className="py-1.5 px-2 text-center">Kills</th>
                    <th className="py-1.5 px-2 text-center">Total Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {previewRows.map((row, idx) => {
                    const placePts = getPlacementPoints(row.rank, gameName);
                    const totalPts = placePts + row.kills;
                    return (
                      <tr key={row.id} className={activeStyle.rowBg}>
                        <td className="py-2 px-2 font-bold" style={{ color: activeStyle.primaryColor }}>
                          #{idx + 1}
                        </td>
                        <td className="py-2 px-2 font-semibold text-white">
                          {row.teamName}
                        </td>
                        <td className="py-2 px-2 text-center text-slate-300">
                          {placePts}
                        </td>
                        <td className="py-2 px-2 text-center text-amber-300 font-bold">
                          {row.kills}
                        </td>
                        <td
                          className="py-2 px-2 text-center font-black text-sm font-['Chakra_Petch']"
                          style={{ color: activeStyle.accentColor }}
                        >
                          {totalPts}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preset Styles Grid */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Esports Preset Styles
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_TABLE_STYLES.map((style) => {
                const isSelected = selectedTheme === style.themeId;
                return (
                  <button
                    key={style.themeId}
                    type="button"
                    onClick={() => {
                      setSelectedTheme(style.themeId);
                      setCustomImage(undefined);
                    }}
                    className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900 border-amber-400 shadow-lg shadow-amber-400/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white font-['Chakra_Petch']">
                        {style.name}
                      </span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-amber-400 text-black flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <div
                        className="w-5 h-5 rounded border border-white/20"
                        style={{ backgroundColor: style.primaryColor }}
                        title="Primary Color"
                      />
                      <div
                        className="w-5 h-5 rounded border border-white/20"
                        style={{ backgroundColor: style.accentColor }}
                        title="Accent Color"
                      />
                      <span className="text-[10px] font-mono text-slate-400">
                        {style.fontStyle === 'mono' ? 'Monospace Code' : 'Chakra Esports'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Wallpaper & Gallery Section */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold mb-3 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              Gallery Wallpapers & Custom Background Upload
            </h4>

            {/* Presets */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
              {GALLERY_BACKGROUND_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    setCustomImage(preset.previewUrl);
                    setSelectedTheme('custom-gallery');
                  }}
                  className={`group relative rounded-xl overflow-hidden border transition-all cursor-pointer h-20 ${
                    customImage === preset.previewUrl && selectedTheme === 'custom-gallery'
                      ? 'border-amber-400 ring-2 ring-amber-400/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={preset.previewUrl}
                    alt={preset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-2">
                    <span className="text-[10px] font-mono text-white font-bold truncate">
                      {preset.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* Upload Button */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-xs font-bold text-white font-['Chakra_Petch'] uppercase flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Upload className="w-4 h-4 text-cyan-400" />
                <span>Upload From Device (Max 3MB)</span>
              </button>

              {customImage && selectedTheme === 'custom-gallery' && (
                <button
                  type="button"
                  onClick={() => {
                    setCustomImage(undefined);
                    setSelectedTheme('titanium-dark');
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono underline cursor-pointer"
                >
                  Remove Custom Wallpaper
                </button>
              )}
            </div>

            {uploadError && (
              <p className="mt-2 text-xs text-rose-400 font-mono">{uploadError}</p>
            )}

            {/* Custom Colors when in custom mode */}
            {selectedTheme === 'custom-gallery' && (
              <div className="mt-4 p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono text-slate-300">
                    Primary Accent:
                  </label>
                  <input
                    type="color"
                    value={customPrimaryColor}
                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono text-slate-300">
                    Points Accent:
                  </label>
                  <input
                    type="color"
                    value={customAccentColor}
                    onChange={(e) => setCustomAccentColor(e.target.value)}
                    className="w-8 h-8 rounded border border-slate-700 cursor-pointer bg-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono cursor-pointer border border-slate-800"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-black uppercase text-xs font-['Chakra_Petch'] flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20 active:scale-95"
          >
            <Check className="w-4 h-4" />
            <span>Apply Selected Style</span>
          </button>
        </div>
      </div>
    </div>
  );
};
