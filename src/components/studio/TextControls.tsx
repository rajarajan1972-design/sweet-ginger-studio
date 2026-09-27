'use client';

import React, { useState } from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { Type, Plus, Trash2, ArrowUp, ArrowDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const GOOGLE_FONTS = [
  { name: 'Outfit', family: 'Outfit, sans-serif' },
  { name: 'Inter', family: 'Inter, sans-serif' },
  { name: 'Playfair Display', family: 'Playfair Display, serif' },
  { name: 'Bebas Neue', family: 'Bebas Neue, sans-serif' },
  { name: 'Pacifico', family: 'Pacifico, cursive' },
  { name: 'Montserrat', family: 'Montserrat, sans-serif' },
];

const TEXT_COLORS = [
  { name: 'Pitch Black', hex: '#111827' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Jaipur Gold', hex: '#D97706' },
  { name: 'Crimson Red', hex: '#DC2626' },
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Emerald Green', hex: '#047857' },
  { name: 'Royal Purple', hex: '#6D28D9' },
  { name: 'Hot Pink', hex: '#DB2777' },
];

export const TextControls: React.FC = () => {
  const {
    selectedView,
    frontLayers,
    backLayers,
    selectedLayerId,
    setSelectedLayerId,
    addTextLayer,
    updateLayer,
    removeLayer,
    moveLayerDepth,
  } = useDesignStore();

  const [inputVal, setInputVal] = useState('SWEET GINGER');

  const layers = selectedView === 'front' ? frontLayers : backLayers;
  const activeLayer = layers.find((l) => l.id === selectedLayerId && l.type === 'text');

  const handleAddText = () => {
    if (!inputVal.trim()) return;
    addTextLayer(inputVal.trim(), 'Outfit', '#111827');
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm space-y-5">
      <div>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
          <Type className="w-4 h-4 text-amber-600" />
          2. Add & Edit Text
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Type custom text, choose typography, colors, and arrangement
        </p>
      </div>

      {/* Input box + Add Text Button */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
          placeholder="Enter text..."
          className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 font-medium"
        />
        <button
          onClick={handleAddText}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          Add Text
        </button>
      </div>

      {/* Selected Text Layer Controls */}
      {activeLayer ? (
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800">
              Active Text Settings
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveLayerDepth(activeLayer.id, 'up')}
                title="Bring Forward"
                className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => moveLayerDepth(activeLayer.id, 'down')}
                title="Send Backward"
                className="p-1.5 rounded-lg text-neutral-600 hover:bg-neutral-200"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => removeLayer(activeLayer.id)}
                title="Delete Text"
                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Edit Text Content */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
              Text Value:
            </label>
            <input
              type="text"
              value={activeLayer.text || ''}
              onChange={(e) => updateLayer(activeLayer.id, { text: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg border border-neutral-300 text-xs font-medium text-neutral-900 bg-white"
            />
          </div>

          {/* Font Family Picker */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
              Font Family:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {GOOGLE_FONTS.map((font) => (
                <button
                  key={font.name}
                  onClick={() => updateLayer(activeLayer.id, { fontFamily: font.name })}
                  className={`px-2.5 py-1.5 rounded-lg text-xs text-left border transition-all truncate ${
                    activeLayer.fontFamily === font.name
                      ? 'border-amber-600 bg-amber-100/60 text-amber-950 font-bold'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                  }`}
                  style={{ fontFamily: font.family }}
                >
                  {font.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Selector & Custom Numeric Input */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 mb-1.5">
              <span>Font Size (pts / px):</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min="4"
                  max="120"
                  value={activeLayer.fontSize || 32}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val)) {
                      updateLayer(activeLayer.id, { fontSize: Math.max(4, Math.min(120, val)) });
                    }
                  }}
                  className="w-16 px-2 py-1 text-xs font-mono font-bold text-center text-neutral-900 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-neutral-400">pt</span>
              </div>
            </div>
            
            <input
              type="range"
              min="4"
              max="120"
              value={activeLayer.fontSize || 32}
              onChange={(e) => updateLayer(activeLayer.id, { fontSize: parseInt(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />

            {/* Quick Font Size Presets */}
            <div className="flex items-center justify-between gap-1 mt-2">
              {[8, 10, 12, 16, 20, 24, 32, 48, 64].map((size) => (
                <button
                  key={size}
                  onClick={() => updateLayer(activeLayer.id, { fontSize: size })}
                  className={`px-2 py-1 rounded text-[10px] font-mono transition-all ${
                    activeLayer.fontSize === size
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
              Text Alignment:
            </label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map((align) => (
                <button
                  key={align}
                  onClick={() => updateLayer(activeLayer.id, { align })}
                  className={`flex-1 py-1 rounded-lg border text-xs flex items-center justify-center ${
                    activeLayer.align === align
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  {align === 'left' && <AlignLeft className="w-4 h-4" />}
                  {align === 'center' && <AlignCenter className="w-4 h-4" />}
                  {align === 'right' && <AlignRight className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Text Color Swatches */}
          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1.5">
              Text Color:
            </label>
            <div className="flex flex-wrap gap-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => updateLayer(activeLayer.id, { fill: color.hex })}
                  title={color.name}
                  className={`w-6 h-6 rounded-full border border-neutral-300 transition-transform ${
                    activeLayer.fill === color.hex ? 'scale-125 ring-2 ring-amber-500' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl border border-dashed border-neutral-300 text-center text-xs text-neutral-400">
          Select or add a text layer on the garment to customize font, size, and colors.
        </div>
      )}
    </div>
  );
};
