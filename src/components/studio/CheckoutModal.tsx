'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useDesignStore } from '@/store/useDesignStore';
import { X, ShoppingBag, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const {
    selectedProduct,
    selectedColor,
    selectedPrintMethod,
    orderType,
    frontLayers,
    backLayers,
    customerName,
    customerEmail,
    customerPhone,
    companyName,
    setCustomerDetails,
    getTotalQuantity,
    getUnitPrice,
    getTotalPrice,
    placeOrder,
  } = useDesignStore();

  const [name, setName] = useState(customerName || '');
  const [email, setEmail] = useState(customerEmail || '');
  const [phone, setPhone] = useState(customerPhone || '');
  const [company, setCompany] = useState(companyName || '');
  const [showJsonPayload, setShowJsonPayload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalQty = getTotalQuantity();
  const unitPrice = getUnitPrice();
  const totalPrice = getTotalPrice();

  const hasArtwork = frontLayers.length > 0 || backLayers.length > 0;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasArtwork) {
      alert('Please add at least one text or artwork layer before placing your order!');
      return;
    }

    setIsSubmitting(true);
    setCustomerDetails({ name, email, phone, company });

    setTimeout(async () => {
      const newOrder = placeOrder();

      // Dispatch order confirmation email to the customer
      try {
        await fetch('/api/orders/email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'confirmation',
            order: newOrder,
          }),
        });
      } catch (err) {
        console.error('[CheckoutModal] Failed to dispatch order confirmation email:', err);
      }

      setIsSubmitting(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      onOrderSuccess(newOrder.id);
      onClose();
    }, 800);
  };

  const payloadSummary = {
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    color: selectedColor.name,
    printMethod: selectedPrintMethod,
    orderType,
    totalQuantity: totalQty,
    unitPrice: `₹${unitPrice.toFixed(2)}`,
    totalPrice: `₹${totalPrice.toFixed(2)}`,
    frontLayersCount: frontLayers.length,
    backLayersCount: backLayers.length,
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-neutral-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">
                Review & Confirm Order
              </h2>
              <p className="text-xs text-neutral-400">
                Sweet Ginger Fashions Jaipur Manufacturing Direct
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 space-y-6">
          {/* Order Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-500 block mb-1">
                Selected Product Specs
              </span>
              <h4 className="text-xs font-bold text-neutral-900">{selectedProduct.name}</h4>
              <div className="mt-2 space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Garment Color:</span>
                  <span className="font-semibold text-neutral-900">{selectedColor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Customization:</span>
                  <span className="font-semibold uppercase text-amber-700">{selectedPrintMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span>Front/Back Design:</span>
                  <span className="font-semibold text-neutral-900">
                    {frontLayers.length} Front / {backLayers.length} Back
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t md:border-t-0 md:border-l border-neutral-200 pt-3 md:pt-0 md:pl-4">
              <span className="text-[10px] uppercase font-extrabold tracking-wider text-neutral-500 block mb-1">
                Quantity & Financials
              </span>
              <div className="space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Order Type:</span>
                  <span className="font-semibold text-neutral-900 uppercase">{orderType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Quantity:</span>
                  <span className="font-bold text-neutral-900 font-mono">{totalQty} pcs</span>
                </div>
                <div className="flex justify-between">
                  <span>Unit Price:</span>
                  <span className="font-semibold text-neutral-900 font-mono">₹{unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-neutral-200 pt-1 text-sm font-bold text-neutral-900">
                  <span>Order Total:</span>
                  <span className="text-amber-600 font-mono">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details Inputs */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
              Customer & Shipping Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Shankar Hemrajani"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shankar@sweetginger.in"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98290 00000"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Company / Organization (Optional)
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Sweet Ginger Fashions"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Toggle JSON Design Payload Inspector */}
          <div>
            <button
              type="button"
              onClick={() => setShowJsonPayload(!showJsonPayload)}
              className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>{showJsonPayload ? 'Hide' : 'Inspect'} Design Payload Payload JSON</span>
            </button>
            {showJsonPayload && (
              <pre className="mt-2 p-3 bg-neutral-900 text-amber-300 text-[10px] font-mono rounded-xl overflow-x-auto max-h-40">
                {JSON.stringify(payloadSummary, null, 2)}
              </pre>
            )}
          </div>

          {/* Footer Submit Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Prints directly at Ginger Prints Jaipur</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !hasArtwork}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-extrabold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isSubmitting ? (
                'Processing Order...'
              ) : (
                <>
                  Submit Order & Send to Print Queue
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
