'use client';

import React, { useRef, useState } from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { Image as ImageIcon, Upload, Sparkles, Wand2, Scissors, Check, AlertCircle, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

const CLIPART_GALLERY = [
  {
    id: 'tiger-mascot',
    title: 'Jaipur Royal Tiger',
    category: 'Mascots',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M50 10L60 30L85 35L65 50L72 75L50 60L28 75L35 50L15 35L40 30L50 10Z" fill="#D97706" stroke="#111827" stroke-width="4"/><circle cx="50" cy="45" r="10" fill="#111827"/><path d="M42 42L45 45M58 42L55 45" stroke="#FFFFFF" stroke-width="2"/></svg>`,
  },
  {
    id: 'eagle-badge',
    title: 'Heritage Crest Badge',
    category: 'Crests',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 5 L85 20 L85 60 C85 80 50 95 50 95 C50 95 15 80 15 60 L15 20 Z" fill="#1E3A8A" stroke="#D97706" stroke-width="5"/><path d="M35 45 L50 30 L65 45 L50 75 Z" fill="#D97706"/></svg>`,
  },
  {
    id: 'vintage-typography',
    title: 'Jaipur Athletic 1974',
    category: 'Vintage',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><text x="50%" y="45%" text-anchor="middle" font-family="Outfit" font-weight="900" font-size="28" fill="#DC2626">JAIPUR</text><text x="50%" y="70%" text-anchor="middle" font-family="Outfit" font-weight="700" font-size="16" fill="#111827">ATHLETIC 74</text></svg>`,
  },
  {
    id: 'retro-skull-star',
    title: 'Thunder Star Icon',
    category: 'Icons',
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" fill="#047857"/><circle cx="50" cy="48" r="14" fill="#FFFFFF"/></svg>`,
  },
];

export const ArtworkControls: React.FC = () => {
  const {
    selectedView,
    frontLayers,
    backLayers,
    selectedLayerId,
    setSelectedLayerId,
    addImageLayer,
    updateLayer,
    removeLayer,
    moveLayerDepth,
    toggleLayerBackgroundRemoved,
  } = useDesignStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  const layers = selectedView === 'front' ? frontLayers : backLayers;
  const activeImageLayer = layers.find((l) => l.id === selectedLayerId && l.type === 'image');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new window.Image();
      img.src = dataUrl;
      img.onload = () => {
        const aspect = img.width / img.height;
        addImageLayer(dataUrl, aspect);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSelectClipart = (svgString: string) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    addImageLayer(url, 1.0);
  };

  const handleGenerateAi = () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiError('');

    setTimeout(() => {
      const promptLower = aiPrompt.toLowerCase();
      let svgGraphic = '';

      if (promptLower.includes('tiger')) {
        svgGraphic = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="46" fill="#D97706" stroke="#111827" stroke-width="4"/><polygon points="50,15 62,38 88,42 68,58 75,84 50,68 25,84 32,58 12,42 38,38" fill="#111827"/><circle cx="50" cy="50" r="10" fill="#F59E0B"/><text x="50%" y="78%" text-anchor="middle" font-family="Outfit" font-weight="900" font-size="10" fill="#FFFFFF">JAIPUR TIGER</text></svg>`;
      } else if (promptLower.includes('shield') || promptLower.includes('crest')) {
        svgGraphic = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50 5 L88 22 L88 58 C88 78 50 95 50 95 C50 95 12 78 12 58 L12 22 Z" fill="#1E3A8A" stroke="#F59E0B" stroke-width="4"/><path d="M50 15 L78 28 L78 54 C78 70 50 84 50 84 C50 84 22 70 22 54 L22 28 Z" fill="#D97706"/><polygon points="50,30 55,42 68,43 58,52 61,64 50,57 39,64 42,52 32,43 45,42" fill="#FFFFFF"/><text x="50%" y="76%" text-anchor="middle" font-family="Outfit" font-weight="800" font-size="9" fill="#FFFFFF">ROYAL JAIPUR</text></svg>`;
      } else if (promptLower.includes('mandala') || promptLower.includes('block')) {
        svgGraphic = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="none" stroke="#047857" stroke-width="4"/><circle cx="50" cy="50" r="32" fill="#047857"/><circle cx="50" cy="50" r="18" fill="#F59E0B"/><circle cx="50" cy="50" r="8" fill="#FFFFFF"/><circle cx="50" cy="18" r="5" fill="#047857"/><circle cx="50" cy="82" r="5" fill="#047857"/><circle cx="18" cy="50" r="5" fill="#047857"/><circle cx="82" cy="50" r="5" fill="#047857"/></svg>`;
      } else {
        svgGraphic = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" rx="20" fill="#111827"/><circle cx="50" cy="50" r="32" fill="#D97706"/><polygon points="50,26 57,40 72,42 61,52 64,66 50,59 36,66 39,52 28,42 43,40" fill="#FFFFFF"/><text x="50%" y="82%" text-anchor="middle" font-family="Outfit" font-weight="bold" font-size="11" fill="#FFFFFF">${aiPrompt.trim().substring(0, 10).toUpperCase()}</text></svg>`;
      }

      handleSelectClipart(svgGraphic);
      setIsAiLoading(false);
      setAiPrompt('');
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm space-y-5">
      <div>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-amber-600" />
          3. Upload Artwork & Graphics
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Upload custom logos (PNG/JPG) or generate artwork
        </p>
      </div>

      {/* Upload Button */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/png, image/jpeg, image/svg+xml"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-amber-500/60 bg-amber-50/50 hover:bg-amber-50 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95"
      >
        <Upload className="w-4 h-4 text-amber-600" />
        Upload Custom Logo or Photo (PNG / JPG)
      </button>

      {/* Active Image Layer Controls */}
      {activeImageLayer && (
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800">
              Active Artwork Layer
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveLayerDepth(activeImageLayer.id, 'up')}
                title="Bring Forward"
                className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveLayerDepth(activeImageLayer.id, 'down')}
                title="Send Backward"
                className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200 transition-colors"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  removeLayer(activeImageLayer.id);
                  setSelectedLayerId(null);
                }}
                title="Delete Artwork (or press Del key)"
                className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-100 flex items-center gap-1 text-xs font-bold transition-all active:scale-95"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Delete</span>
                <kbd className="px-1 py-0.2 bg-neutral-200/80 rounded text-[9px] font-mono text-neutral-600">Del</kbd>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-700">
              <Scissors className="w-4 h-4 text-amber-600" />
              <span>Remove White Background</span>
            </div>
            <button
              onClick={() => toggleLayerBackgroundRemoved(activeImageLayer.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeImageLayer.isBackgroundRemoved
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              {activeImageLayer.isBackgroundRemoved ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" /> Removed
                </>
              ) : (
                'Apply Background Cut'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Local Royalty-Free Clip-Art Gallery */}
      <div>
        <label className="text-xs font-bold text-neutral-800 block mb-2">
          Featured Royalty-Free Clip-Art Gallery:
        </label>
        <div className="grid grid-cols-4 gap-2">
          {CLIPART_GALLERY.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectClipart(item.svg)}
              title={item.title}
              className="p-2 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-amber-50 hover:border-amber-400 transition-all flex flex-col items-center justify-center gap-1"
            >
              <div
                className="w-10 h-10 flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: item.svg }}
              />
              <span className="text-[10px] font-semibold text-neutral-600 truncate w-full text-center">
                {item.title}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AI Design Prompt Generator (Drop Studio Style with Fallback) */}
      <div className="border-t border-neutral-200 pt-4">
        <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          AI Artwork Prompt Generator:
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. Royal Jaipur Crest..."
            className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-neutral-50 focus:bg-white"
          />
          <button
            onClick={handleGenerateAi}
            disabled={isAiLoading || !aiPrompt.trim()}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center gap-1"
          >
            {isAiLoading ? (
              <Wand2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            )}
            Generate
          </button>
        </div>
        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['Royal Jaipur Crest', 'Jaipur Tiger', 'Block Print Mandala', 'Gold Shield Badge'].map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setAiPrompt(suggestion)}
              className="px-2 py-0.5 rounded-lg bg-neutral-100 hover:bg-amber-100 text-[10px] font-semibold text-neutral-600 hover:text-amber-900 border border-neutral-200 transition-colors"
            >
              + {suggestion}
            </button>
          ))}
        </div>
        {aiError && (
          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> {aiError}
          </p>
        )}
      </div>
    </div>
  );
};
