'use client';

import React from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { PRODUCTS } from '@/data/products';
import { PrintMethod, ProductCategory } from '@/types/design';
import { Check, Layers } from 'lucide-react';

export const ProductPicker: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    selectedColor,
    setSelectedColor,
    selectedPrintMethod,
    setSelectedPrintMethod,
  } = useDesignStore();

  const categories: { id: ProductCategory; label: string }[] = [
    { id: 't-shirts', label: 'T-Shirts & Polos' },
    { id: 'hoodies', label: 'Hoodies & Fleece' },
    { id: 'caps', label: 'Caps & Accessories' },
  ];

  const [activeCategory, setActiveCategory] = React.useState<ProductCategory>(selectedProduct.category);

  const handleCategoryChange = (catId: ProductCategory) => {
    setActiveCategory(catId);
    const firstProduct = PRODUCTS.find((p) => p.category === catId);
    if (firstProduct) {
      setSelectedProduct(firstProduct);
    }
  };

  const filteredProducts = PRODUCTS.filter((p) => p.category === activeCategory);

  const printMethodInfo: Record<PrintMethod, { name: string; desc: string }> = {
    dtf: { name: 'DTF Printing', desc: 'Direct-to-Film full color vibrant print. Unlimited colors & details.' },
    embroidery: { name: 'Custom Embroidery', desc: 'High-density stitch work. Premium corporate logo look.' },
    vinyl: { name: 'Vinyl Transfer', desc: 'Single-color sharp cut vector graphics. Matte finish.' },
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm space-y-6">
      <div>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          1. Pick Your Product
        </h3>
        <p className="text-xs text-neutral-500 mt-1">
          Choose from Shankar&apos;s Jaipur manufacturing blanks
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-600 text-white shadow-md scale-105'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filteredProducts.map((product) => {
          const isSelected = selectedProduct.id === product.id;
          return (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/30 shadow-md scale-[1.02]'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                    {product.name}
                  </h4>
                  <span className="text-xs font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md whitespace-nowrap">
                    ₹{product.basePrice.toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 line-clamp-2 mt-1.5 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-neutral-400 border-t border-neutral-200/60 pt-2">
                <span>{product.availableSizes.join(', ')}</span>
                <span className="capitalize">{product.supportedMethods.join(' • ')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Color Selection Palette */}
      <div className="border-t border-neutral-200 pt-5">
        <label className="text-xs font-bold text-neutral-800 block mb-2">
          Garment Color: <span className="font-normal text-neutral-600">{selectedColor.name}</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {selectedProduct.availableColors.map((color) => {
            const isSelected = selectedColor.id === color.id;
            return (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                title={color.name}
                className={`w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center relative shadow-sm ${
                  isSelected ? 'border-amber-600 scale-110 ring-2 ring-amber-500/30' : 'border-neutral-300 hover:scale-105'
                }`}
                style={{ backgroundColor: color.hex }}
              >
                {isSelected && (
                  <Check
                    className={`w-4 h-4 stroke-[3] ${
                      color.darkText ? 'text-neutral-900' : 'text-white'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Print Technique Selector */}
      <div className="border-t border-neutral-200 pt-5">
        <label className="text-xs font-bold text-neutral-800 block mb-2">
          Print / Customization Method:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {selectedProduct.supportedMethods.map((method) => {
            const isSelected = selectedPrintMethod === method;
            const info = printMethodInfo[method];
            return (
              <button
                key={method}
                onClick={() => setSelectedPrintMethod(method)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-amber-500 bg-amber-50 text-amber-950 font-bold shadow-sm'
                    : 'border-neutral-200 text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                <div className="text-xs uppercase tracking-wider font-extrabold">{info.name}</div>
                <div className="text-[10px] text-neutral-500 font-normal leading-tight mt-1 hidden sm:block">
                  {info.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
