'use client';

import React from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { DISCOUNT_TIERS, PRINT_SIDE_SURCHARGE } from '@/data/products';
import { SizeCode } from '@/types/design';
import { Calculator, Tag } from 'lucide-react';

export const QuantityPricingMatrix: React.FC = () => {
  const {
    selectedProduct,
    orderType,
    setOrderType,
    singleQuantity,
    setSingleQuantity,
    sizeMatrix,
    setSizeMatrixCount,
    resetSizeMatrix,
    frontLayers,
    backLayers,
    getTotalQuantity,
    getDiscountPercent,
    getUnitPrice,
    getTotalPrice,
  } = useDesignStore();

  const totalQty = getTotalQuantity();
  const discountPct = getDiscountPercent();
  const unitPrice = getUnitPrice();
  const totalPrice = getTotalPrice();

  const hasBothSides = frontLayers.length > 0 && backLayers.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-neutral-200/80 p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Calculator className="w-4 h-4 text-amber-600" />
            4. Quantity & Wholesale Pricing
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Single retail order or B2B bulk volume discount matrix
          </p>
        </div>

        {/* Order Mode Toggle */}
        <div className="bg-neutral-100 p-1 rounded-xl flex items-center border border-neutral-200">
          <button
            onClick={() => setOrderType('b2c')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              orderType === 'b2c'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Single (B2C)
          </button>
          <button
            onClick={() => setOrderType('b2b')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              orderType === 'b2b'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Bulk (B2B)
          </button>
        </div>
      </div>

      {/* Mode 1: Single Order (B2C) */}
      {orderType === 'b2c' ? (
        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-neutral-800 block">Order Quantity:</label>
            <span className="text-[11px] text-neutral-500">Retail single piece customization</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSingleQuantity(singleQuantity - 1)}
              className="w-8 h-8 rounded-lg bg-white border border-neutral-300 text-neutral-800 font-bold hover:bg-neutral-100 flex items-center justify-center"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              value={singleQuantity}
              onChange={(e) => setSingleQuantity(parseInt(e.target.value) || 1)}
              className="w-14 text-center py-1 rounded-lg border border-neutral-300 font-mono text-xs font-bold bg-white text-neutral-900"
            />
            <button
              onClick={() => setSingleQuantity(singleQuantity + 1)}
              className="w-8 h-8 rounded-lg bg-white border border-neutral-300 text-neutral-800 font-bold hover:bg-neutral-100 flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      ) : (
        /* Mode 2: Bulk Wholesale Size Matrix (B2B) */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800">
              Sweet Ginger B2B Size Breakdown Matrix:
            </label>
            <button
              onClick={resetSizeMatrix}
              className="text-[11px] text-rose-600 hover:underline font-semibold"
            >
              Reset Counts
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {selectedProduct.availableSizes.map((size) => (
              <div
                key={size}
                className="bg-neutral-50 p-2 rounded-xl border border-neutral-200 text-center"
              >
                <span className="text-xs font-bold text-neutral-700 block mb-1">
                  Size {size}
                </span>
                <input
                  type="number"
                  min="0"
                  value={sizeMatrix[size] || 0}
                  onChange={(e) => setSizeMatrixCount(size as SizeCode, parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 rounded-lg border border-neutral-300 font-mono text-xs font-bold bg-white text-neutral-900 focus:ring-1 focus:ring-amber-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Volume Discount Tiers Indicator */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-bold text-amber-950 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-amber-700" />
            Volume Wholesale Discount Tier:
          </span>
          {discountPct > 0 ? (
            <span className="font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full text-[11px]">
              {discountPct}% SAVINGS APPLIED
            </span>
          ) : (
            <span className="text-neutral-500 text-[11px]">Order 6+ pcs for Bulk Discount</span>
          )}
        </div>

        <div className="grid grid-cols-4 gap-1.5 text-[10px]">
          {DISCOUNT_TIERS.map((tier) => {
            const isActive = totalQty >= tier.minQty && (tier.maxQty === null || totalQty <= tier.maxQty);
            return (
              <div
                key={tier.label}
                className={`p-1.5 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-amber-600 text-white font-bold shadow-sm'
                    : 'bg-white/80 text-neutral-600 border border-neutral-200'
                }`}
              >
                <div className="font-mono font-bold">
                  {tier.minQty}{tier.maxQty ? `-${tier.maxQty}` : '+'} pcs
                </div>
                <div className="truncate">{tier.discountPercent}% Off</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pricing Summary Calculation Box */}
      <div className="bg-neutral-900 text-white rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-neutral-300">
          <span>Product Base Unit Price ({selectedProduct.name}):</span>
          <span className="font-mono">₹{selectedProduct.basePrice.toFixed(2)}</span>
        </div>

        {discountPct > 0 && (
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Bulk Volume Tier Discount ({discountPct}%):</span>
            <span className="font-mono">-₹{(selectedProduct.basePrice * (discountPct / 100)).toFixed(2)} / pc</span>
          </div>
        )}

        {hasBothSides && (
          <div className="flex items-center justify-between text-xs text-amber-400">
            <span>Dual-Side Print Fee (Front + Back):</span>
            <span className="font-mono">+₹{PRINT_SIDE_SURCHARGE.bothSides.toFixed(2)} / pc</span>
          </div>
        )}

        <div className="border-t border-neutral-800 pt-2.5 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-400 block">Final Order Total:</span>
            <span className="text-[11px] text-neutral-400">
              {totalQty} pcs @ ₹{unitPrice.toFixed(2)} / pc
            </span>
          </div>
          <div className="text-right">
            <span className="text-xl font-extrabold text-amber-400 font-mono block">
              ₹{totalPrice.toFixed(2)}
            </span>
            <span className="text-[10px] text-neutral-400">Taxes included • Jaipur Factory direct</span>
          </div>
        </div>
      </div>
    </div>
  );
};
