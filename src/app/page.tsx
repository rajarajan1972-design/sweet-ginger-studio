'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Header } from '@/components/studio/Header';
import { ProductPicker } from '@/components/studio/ProductPicker';
import { TextControls } from '@/components/studio/TextControls';
import { ArtworkControls } from '@/components/studio/ArtworkControls';
import { QuantityPricingMatrix } from '@/components/studio/QuantityPricingMatrix';
import { CheckoutModal } from '@/components/studio/CheckoutModal';
import { AdminDashboard } from '@/components/studio/AdminDashboard';
import { Sparkles, Shirt, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

// Dynamically import Konva GarmentCanvas with ssr: false to prevent window undefined SSR issues
const GarmentCanvas = dynamic(() => import('@/components/garment/GarmentCanvas'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] md:h-[620px] bg-neutral-100 rounded-2xl border border-neutral-200 animate-pulse flex items-center justify-center text-neutral-400 text-xs font-semibold">
      Loading Garment Canvas Studio...
    </div>
  ),
});

export default function StudioPage() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'product' | 'text' | 'artwork' | 'pricing'>('product');
  const [successOrderNumber, setSuccessOrderNumber] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      {/* Studio Header */}
      <Header
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Main Studio Workspace Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Garment Canvas Stage (7 Columns on Desktop) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-neutral-200/90 shadow-sm space-y-4">
            {/* Live Interactive Garment Canvas */}
            <GarmentCanvas />

            {/* Studio Bottom Quick Features */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                <span className="font-bold text-neutral-900 block">100% Cotton & Blanks</span>
                <span className="text-[10px] text-neutral-500">Sweet Ginger Factory</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                <span className="font-bold text-neutral-900 block">Ginger Prints Quality</span>
                <span className="text-[10px] text-neutral-500">DTF, Embroidery, Vinyl</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/70">
                <span className="font-bold text-neutral-900 block">B2B Volume Pricing</span>
                <span className="text-[10px] text-neutral-500">Up to 40% Tier Discount</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Modular Control Panel Tabs (5 Columns on Desktop) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Mobile & Tablet Studio Navigation Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-neutral-200/80 rounded-2xl border border-neutral-300">
            <button
              onClick={() => setActiveTab('product')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                activeTab === 'product'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <span className="hidden sm:inline">1. Product</span>
              <span className="sm:hidden">1. Prod</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                activeTab === 'text'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <span className="hidden sm:inline">2. Text</span>
              <span className="sm:hidden">2. Text</span>
            </button>
            <button
              onClick={() => setActiveTab('artwork')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                activeTab === 'artwork'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <span className="hidden sm:inline">3. Artwork</span>
              <span className="sm:hidden">3. Art</span>
            </button>
            <button
              onClick={() => setActiveTab('pricing')}
              className={`py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all ${
                activeTab === 'pricing'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950'
              }`}
            >
              <span className="hidden sm:inline">4. Pricing</span>
              <span className="sm:hidden">4. Price</span>
            </button>
          </div>

          {/* Render Active Control Panel Section */}
          <div className="space-y-4">
            {activeTab === 'product' && <ProductPicker />}
            {activeTab === 'text' && <TextControls />}
            {activeTab === 'artwork' && <ArtworkControls />}
            {activeTab === 'pricing' && <QuantityPricingMatrix />}

            {/* Quick Next Step Action */}
            <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-neutral-200 shadow-sm">
              <span className="text-xs text-neutral-500 font-medium">
                {activeTab === 'product' && 'Next: Add Custom Text & Typography'}
                {activeTab === 'text' && 'Next: Upload Artwork & Logos'}
                {activeTab === 'artwork' && 'Next: Set Quantities & B2B Tiers'}
                {activeTab === 'pricing' && 'Ready to place custom order!'}
              </span>
              <button
                onClick={() => {
                  if (activeTab === 'product') setActiveTab('text');
                  else if (activeTab === 'text') setActiveTab('artwork');
                  else if (activeTab === 'artwork') setActiveTab('pricing');
                  else setIsCheckoutOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                {activeTab === 'pricing' ? 'Proceed to Checkout' : 'Continue'}
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Success Notification Banner */}
      {successOrderNumber && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-amber-500/50 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Order #{successOrderNumber} Placed!</h4>
            <p className="text-[11px] text-neutral-300">Sent directly to Ginger Prints Jaipur queue.</p>
          </div>
          <button
            onClick={() => {
              setSuccessOrderNumber(null);
              setIsAdminOpen(true);
            }}
            className="ml-2 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold"
          >
            View Queue
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(orderId) => setSuccessOrderNumber(orderId)}
      />

      {/* Admin Production Queue Dashboard */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}
