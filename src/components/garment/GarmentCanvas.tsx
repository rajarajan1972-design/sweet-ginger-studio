'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer, Rect } from 'react-konva';
import Konva from 'konva';
import { useDesignStore } from '@/store/useDesignStore';
import { CanvasLayer } from '@/types/design';
import { Trash2 } from 'lucide-react';

interface URLImageProps {
  layer: CanvasLayer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasLayer>) => void;
  boundary: { x: number; y: number; width: number; height: number };
}

const URLImage: React.FC<URLImageProps> = ({ layer, isSelected, onSelect, onChange, boundary }) => {
  const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (!layer.imageUrl) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.src = layer.imageUrl;
    img.onload = () => {
      if (layer.isBackgroundRemoved) {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;
          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            if (r > 240 && g > 240 && b > 240) {
              data[i + 3] = 0;
            }
          }
          ctx.putImageData(imgData, 0, 0);
          const processedImg = new window.Image();
          processedImg.src = canvas.toDataURL();
          processedImg.onload = () => setImageObj(processedImg);
        }
      } else {
        setImageObj(img);
      }
    };
  }, [layer.imageUrl, layer.isBackgroundRemoved]);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const posX = boundary.x + layer.x * boundary.width;
  const posY = boundary.y + layer.y * boundary.height;
  const layerWidth = layer.width * boundary.width;
  const layerHeight = layer.height * boundary.height;

  return (
    <>
      <KonvaImage
        ref={shapeRef}
        image={imageObj || undefined}
        x={posX}
        y={posY}
        width={layerWidth}
        height={layerHeight}
        rotation={layer.rotation}
        offsetX={layerWidth / 2}
        offsetY={layerHeight / 2}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const newNormX = (e.target.x() - boundary.x) / boundary.width;
          const newNormY = (e.target.y() - boundary.y) / boundary.height;
          const clampedX = Math.max(0.05, Math.min(0.95, newNormX));
          const clampedY = Math.max(0.05, Math.min(0.95, newNormY));
          onChange({ x: clampedX, y: clampedY });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);

          const newWidthNorm = (node.width() * scaleX) / boundary.width;
          const newHeightNorm = (node.height() * scaleY) / boundary.height;
          const newNormX = (node.x() - boundary.x) / boundary.width;
          const newNormY = (node.y() - boundary.y) / boundary.height;

          onChange({
            x: Math.max(0.05, Math.min(0.95, newNormX)),
            y: Math.max(0.05, Math.min(0.95, newNormY)),
            width: Math.max(0.05, newWidthNorm),
            height: Math.max(0.05, newHeightNorm),
            rotation: Math.round(node.rotation()),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 15 || newBox.height < 15 ? oldBox : newBox)}
        />
      )}
    </>
  );
};

interface TextLayerProps {
  layer: CanvasLayer;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: Partial<CanvasLayer>) => void;
  boundary: { x: number; y: number; width: number; height: number };
}

const TextLayerComponent: React.FC<TextLayerProps> = ({ layer, isSelected, onSelect, onChange, boundary }) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected, layer.fontSize, layer.fontFamily, layer.fill, layer.align, layer.text]);

  const posX = boundary.x + layer.x * boundary.width;
  const posY = boundary.y + layer.y * boundary.height;
  const currentFontSize = layer.fontSize || 32;

  return (
    <>
      <Text
        key={`text-node-${layer.id}-${layer.fontFamily}-${layer.fontSize}-${layer.fill}-${layer.align}-${layer.text}`}
        ref={shapeRef}
        text={layer.text || ''}
        x={posX}
        y={posY}
        width={boundary.width}
        offsetX={boundary.width / 2}
        offsetY={currentFontSize / 2}
        fontFamily={layer.fontFamily || 'Outfit'}
        fontSize={currentFontSize}
        fill={layer.fill || '#111827'}
        fontStyle={`${layer.fontWeight || 'bold'}`}
        align={layer.align || 'center'}
        rotation={layer.rotation || 0}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          const newNormX = (e.target.x() - boundary.x) / boundary.width;
          const newNormY = (e.target.y() - boundary.y) / boundary.height;
          onChange({
            x: Math.max(0.05, Math.min(0.95, newNormX)),
            y: Math.max(0.05, Math.min(0.95, newNormY)),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          node.scaleX(1);
          node.scaleY(1);
          const newFontSize = Math.max(4, Math.min(120, Math.round((node.fontSize() || 32) * scaleX)));

          const newNormX = (node.x() - boundary.x) / boundary.width;
          const newNormY = (node.y() - boundary.y) / boundary.height;

          onChange({
            fontSize: newFontSize,
            x: Math.max(0.05, Math.min(0.95, newNormX)),
            y: Math.max(0.05, Math.min(0.95, newNormY)),
            rotation: Math.round(node.rotation()),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
          boundBoxFunc={(oldBox, newBox) => (newBox.width < 2 || newBox.height < 2 ? oldBox : newBox)}
        />
      )}
    </>
  );
};

export const GarmentCanvas: React.FC = () => {
  const {
    selectedProduct,
    selectedColor,
    setSelectedColor,
    selectedView,
    frontLayers,
    backLayers,
    selectedLayerId,
    setSelectedLayerId,
    updateLayer,
    removeLayer,
    setSelectedView,
  } = useDesignStore();

  const [stageDimension, setStageDimension] = useState(520);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight || Math.min(620, Math.max(450, window.innerHeight - 200));
        // Keep a square stage inside the container
        const dim = Math.min(w - 24, h - 24, 540);
        setStageDimension(Math.max(280, Math.round(dim)));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Global Keyboard Shortcuts (Delete / Backspace removes selected artwork/text layer)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tagName = target?.tagName?.toLowerCase();
      if (
        tagName === 'input' ||
        tagName === 'textarea' ||
        target?.isContentEditable ||
        target?.closest('input') ||
        target?.closest('textarea')
      ) {
        return;
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedLayerId) {
        e.preventDefault();
        removeLayer(selectedLayerId);
        setSelectedLayerId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, removeLayer, setSelectedLayerId]);

  const currentLayers = selectedView === 'front' ? frontLayers : backLayers;
  const activeLayer = currentLayers.find((l) => l.id === selectedLayerId);
  const boundaryConfig = selectedView === 'front' ? selectedProduct.frontBoundary : selectedProduct.backBoundary;

  // Commercial Grade Isolated Studio Blanks
  const blankType = 
    selectedProduct.category === 'caps'
      ? 'cap'
      : selectedProduct.garmentType === 'hoodie'
      ? 'hoodie'
      : selectedProduct.garmentType === 'polo'
      ? 'polo'
      : 'tshirt';

  const viewSuffix = selectedView === 'back' ? '_back' : '';
  const blankImagePath = `/blanks/${blankType}${viewSuffix}_${selectedColor.id}.png`;

  // Print Boundary box coordinates in stage pixels (1:1 aligned to blank image)
  const boundaryPixels = {
    x: boundaryConfig.x * stageDimension,
    y: boundaryConfig.y * stageDimension,
    width: boundaryConfig.width * stageDimension,
    height: boundaryConfig.height * stageDimension,
  };

  const isLightGarment = selectedColor.darkText;

  // Calculate live position text label (e.g. Left Chest vs Center Front)
  const getActivePositionLabel = () => {
    if (!activeLayer) return null;
    if (activeLayer.x > 0.5 && activeLayer.y < 0.4) {
      return 'Position: Left Chest';
    }
    if (activeLayer.x < 0.3 && activeLayer.y < 0.4) {
      return 'Position: Right Chest';
    }
    return `Position: ${selectedView === 'front' ? 'Front Center' : 'Upper Back'}`;
  };

  // Check if active layer is approaching or at the printable boundary edge
  const isNearMargin = activeLayer ? (
    activeLayer.x < 0.12 || activeLayer.x > 0.88 || activeLayer.y < 0.12 || activeLayer.y > 0.88
  ) : false;

  // Boundary lines & zone boxes appear ONLY when user is selecting/editing an element
  const showPrintZoneBoxes = Boolean(selectedLayerId);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[520px] md:h-[620px] bg-gradient-to-b from-neutral-50/80 to-neutral-100/60 rounded-2xl border border-neutral-200/90 shadow-inner flex flex-col items-center justify-center overflow-hidden select-none"
    >
      {/* Studio Quality Indicator */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-30 flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl border border-neutral-200/90 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11px] sm:text-xs font-bold text-neutral-800 tracking-tight">Studio Mockup</span>
        <span className="text-[10px] text-neutral-400 font-mono hidden md:inline">1:1 Commercial Scale</span>
      </div>

      {/* View Switcher Button (Front / Back) */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 flex items-center gap-1 bg-white/95 backdrop-blur border border-neutral-200/90 rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setSelectedView('front')}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedView === 'front'
              ? 'bg-amber-600 text-white shadow'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Front Side
        </button>
        <button
          onClick={() => setSelectedView('back')}
          className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedView === 'back'
              ? 'bg-amber-600 text-white shadow'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
          }`}
        >
          Back Side
        </button>
      </div>

      {/* Central Square Stage bounding BOTH Product Blank & Konva Artwork Stage */}
      <div
        style={{ width: stageDimension, height: stageDimension }}
        className="relative flex items-center justify-center select-none"
      >
        {/* Photorealistic Isolated Product Blank */}
        <img
          key={blankImagePath}
          src={blankImagePath}
          alt={`${selectedProduct.name} - ${selectedColor.name}`}
          className="absolute inset-0 w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.12)] pointer-events-none select-none transition-all duration-200"
        />

        {/* Dynamic Print Zone Outlines (Appears when editing/selecting an element) */}
        {showPrintZoneBoxes && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center animate-in fade-in duration-200 z-10">
            <svg className="w-full h-full">
              {/* Main Chest / Crown Print Boundary Box */}
              <rect
                x={boundaryPixels.x}
                y={boundaryPixels.y}
                width={boundaryPixels.width}
                height={boundaryPixels.height}
                fill={isNearMargin ? 'rgba(245, 158, 11, 0.05)' : 'rgba(0,0,0,0.01)'}
                stroke={isNearMargin ? '#f59e0b' : (isLightGarment ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.75)')}
                strokeWidth={isNearMargin ? '2' : '1.5'}
                strokeDasharray={isNearMargin ? '4 2' : '5 3'}
              />
              {/* Print Zone Label */}
              <text
                x={boundaryPixels.x + 8}
                y={boundaryPixels.y + 20}
                fill={isNearMargin ? '#d97706' : (isLightGarment ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)')}
                fontSize="12"
                fontWeight="bold"
                fontFamily="Outfit, sans-serif"
              >
                {selectedProduct.category === 'caps'
                  ? selectedView === 'front' ? 'Front Crown' : 'Back Strap'
                  : selectedView === 'front' ? 'Front Print Area' : 'Back Print Area'}
                {isNearMargin ? ' (⚠️ Near Margin)' : ''}
              </text>
            </svg>
          </div>
        )}

        {/* Interactive Konva Stage for Artwork & Typography */}
        <div className="absolute inset-0 pointer-events-auto z-20">
          <Stage
            width={stageDimension}
            height={stageDimension}
            onMouseDown={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedLayerId(null);
              }
            }}
            onTouchStart={(e) => {
              if (e.target === e.target.getStage()) {
                setSelectedLayerId(null);
              }
            }}
          >
            <Layer>
              {/* Konva Boundary Outline (Shown when layer selected) */}
              {showPrintZoneBoxes && (
                <Rect
                  x={boundaryPixels.x}
                  y={boundaryPixels.y}
                  width={boundaryPixels.width}
                  height={boundaryPixels.height}
                  stroke={isLightGarment ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.45)'}
                  strokeWidth={1.5}
                  dash={[6, 4]}
                />
              )}

              {/* Render Canvas Layers */}
              {currentLayers.map((layer) => {
                if (layer.type === 'text') {
                  return (
                    <TextLayerComponent
                      key={layer.id}
                      layer={layer}
                      isSelected={selectedLayerId === layer.id}
                      onSelect={() => setSelectedLayerId(layer.id)}
                      onChange={(newAttrs) => updateLayer(layer.id, newAttrs)}
                      boundary={boundaryPixels}
                    />
                  );
                } else {
                  return (
                    <URLImage
                      key={layer.id}
                      layer={layer}
                      isSelected={selectedLayerId === layer.id}
                      onSelect={() => setSelectedLayerId(layer.id)}
                      onChange={(newAttrs) => updateLayer(layer.id, newAttrs)}
                      boundary={boundaryPixels}
                    />
                  );
                }
              })}
            </Layer>
          </Stage>
        </div>
      </div>



      {/* Floating Canvas Legend Notice & Direct Garment Color Swatches */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 max-w-[96%] w-fit px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-neutral-900/95 backdrop-blur border border-neutral-700/80 text-[11px] text-neutral-200 flex flex-col md:flex-row items-center gap-2 sm:gap-3 shadow-xl z-30 pointer-events-auto">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
          <span className="font-semibold text-white truncate max-w-[110px] sm:max-w-[170px] md:max-w-[200px]">{selectedProduct.name}</span>
          <span className="text-neutral-400 font-mono text-[10px] shrink-0">({selectedColor.name})</span>
          {activeLayer && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="font-bold text-amber-300 hidden md:inline">
                • {getActivePositionLabel()}
              </span>
              <button
                onClick={() => {
                  removeLayer(activeLayer.id);
                  setSelectedLayerId(null);
                }}
                title="Delete selected item (Delete or Backspace)"
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[10px] font-bold transition-all ml-1 active:scale-95 shadow-sm shrink-0"
              >
                <Trash2 className="w-3 h-3 text-rose-400" />
                <span>Delete</span>
                <kbd className="px-1 py-0.2 bg-black/40 rounded text-[9px] font-mono text-neutral-300 hidden md:inline">Del</kbd>
              </button>
            </div>
          )}
        </div>

        {/* Quick Garment Color Swatches Bar */}
        <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-neutral-700/80 pt-1.5 md:pt-0 md:pl-3 md:pr-1 shrink-0">
          {selectedProduct.availableColors.map((col) => {
            const isSelected = selectedColor.id === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setSelectedColor(col)}
                title={col.name}
                className={`w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full border transition-all shrink-0 ${
                  isSelected ? 'ring-2 ring-amber-400 scale-110 border-white' : 'border-neutral-500/70 hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GarmentCanvas;
