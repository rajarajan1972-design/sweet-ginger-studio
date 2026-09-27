'use client';

import React from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { Shirt, Sparkles, ShoppingBag, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  onOpenAdmin: () => void;
  onOpenCheckout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAdmin, onOpenCheckout }) => {
  const { orderType, setOrderType, getTotalQuantity, getTotalPrice, orders } = useDesignStore();
  const totalQty = getTotalQuantity();
  const totalPrice = getTotalPrice();

  return (
    <header className="w-full bg-neutral-900 text-white border-b border-neutral-800 sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-amber-600/30">
            <Shirt className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg font-bold tracking-tight text-white">
                Sweet Ginger
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 hidden sm:inline-block">
                Design Studio
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Jaipur Apparel Co. • B2C Retail & B2B Wholesale Blanks
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher (B2C Retail vs B2B Wholesale) */}
        <div className="hidden md:flex items-center bg-neutral-800/90 p-1 rounded-xl border border-neutral-700">
          <button
            onClick={() => setOrderType('b2c')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              orderType === 'b2c'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Single Order (D2C)</span>
          </button>
          <button
            onClick={() => setOrderType('b2b')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              orderType === 'b2b'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bulk Wholesale (B2B)</span>
          </button>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Admin Queue Button */}
          <button
            onClick={onOpenAdmin}
            className="px-2.5 sm:px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors flex items-center gap-1.5 border border-neutral-700/80 shrink-0"
          >
            <LayoutDashboard className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Admin Queue</span>
            {orders.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-neutral-950 font-bold">
                {orders.length}
              </span>
            )}
          </button>

          {/* Checkout Button */}
          <button
            onClick={onOpenCheckout}
            className="px-3 sm:px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-amber-500/20 active:scale-95 whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
            <span>Checkout</span>
            <span suppressHydrationWarning className="bg-neutral-950/20 text-neutral-950 px-1.5 sm:px-2 py-0.5 rounded-md font-mono text-[11px] sm:text-xs">
              ₹{totalPrice.toFixed(0)} <span className="hidden sm:inline">({totalQty} pcs)</span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
