'use client';

import React, { useState } from 'react';
import { useDesignStore } from '@/store/useDesignStore';
import { OrderRecord } from '@/types/design';
import {
  X,
  Download,
  Printer,
  Search,
  FileDown,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus } = useDesignStore();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [emailNotice, setEmailNotice] = useState<string | null>(null);

  const handleStatusChange = async (order: OrderRecord, newStatus: OrderRecord['status']) => {
    updateOrderStatus(order.id, newStatus);
    try {
      await fetch('/api/orders/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'status_update',
          order,
          newStatus,
        }),
      });
      setEmailNotice(`Status update email sent to ${order.customerEmail || 'customer'} (${newStatus.replace('_', ' ').toUpperCase()})`);
      setTimeout(() => setEmailNotice(null), 4500);
    } catch (err) {
      console.error('[AdminDashboard] Failed to dispatch status email:', err);
    }
  };

  if (!isOpen) return null;

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = filterStatus === 'all' || ord.status === filterStatus;
    const matchesSearch =
      ord.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ord.companyName && ord.companyName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const handleDownloadPrintFile = (order: OrderRecord, side: 'front' | 'back') => {
    setIsExporting(`${order.id}-${side}`);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = 3600;
    exportCanvas.height = 4800;
    const ctx = exportCanvas.getContext('2d');

    if (!ctx) {
      setIsExporting(null);
      return;
    }

    ctx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);

    const layers = side === 'front' ? order.frontLayers : order.backLayers;

    if (layers.length === 0) {
      alert(`No artwork layers found on the ${side} side of order ${order.orderNumber}`);
      setIsExporting(null);
      return;
    }

    let loadedCount = 0;
    const checkComplete = () => {
      loadedCount++;
      if (loadedCount >= layers.length) {
        const dataUrl = exportCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `${order.orderNumber}_${side.toUpperCase()}_300DPI_PRINT.png`;
        link.href = dataUrl;
        link.click();
        setIsExporting(null);
      }
    };

    layers.forEach((layer) => {
      const x = layer.x * exportCanvas.width;
      const y = layer.y * exportCanvas.height;
      const w = layer.width * exportCanvas.width;
      const h = layer.height * exportCanvas.height;

      if (layer.type === 'text') {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.font = `${layer.fontWeight || 'bold'} ${Math.round((layer.fontSize || 32) * 6)}px ${layer.fontFamily || 'Outfit'}`;
        ctx.fillStyle = layer.fill || '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(layer.text || '', 0, 0);
        ctx.restore();
        checkComplete();
      } else if (layer.type === 'image' && layer.imageUrl) {
        const img = new window.Image();
        img.crossOrigin = 'Anonymous';
        img.src = layer.imageUrl;
        img.onload = () => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.drawImage(img, -w / 2, -h / 2, w, h);
          ctx.restore();
          checkComplete();
        };
        img.onerror = () => checkComplete();
      } else {
        checkComplete();
      }
    });
  };

  const statusBadges: Record<OrderRecord['status'], { label: string; bg: string; text: string }> = {
    received: { label: 'Received', bg: 'bg-blue-100', text: 'text-blue-800' },
    in_production: { label: 'In Production', bg: 'bg-amber-100', text: 'text-amber-900' },
    printed: { label: 'Printed', bg: 'bg-purple-100', text: 'text-purple-800' },
    shipped: { label: 'Shipped', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-neutral-900 text-white px-6 py-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center font-bold">
              <Printer className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">Ginger Prints Production Hub</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Jaipur Factory Queue
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Order fulfillment queue, print specs, and high-res vector/PNG download engine
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

        {/* Toolbar Controls */}
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search order #, customer, or company..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs text-neutral-900 bg-white"
            />
          </div>

          {/* Status Filters */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {['all', 'received', 'in_production', 'printed', 'shipped'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase whitespace-nowrap transition-all ${
                  filterStatus === st
                    ? 'bg-neutral-900 text-white shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Email Dispatched Live Notification */}
        {emailNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-semibold">{emailNotice}</span>
            </div>
            <button
              onClick={() => setEmailNotice(null)}
              className="text-emerald-600 hover:text-emerald-950 font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Orders Queue List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs space-y-2">
              <Printer className="w-8 h-8 mx-auto text-neutral-300 stroke-1" />
              <p>No orders found matching the filter criteria.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const badge = statusBadges[order.status];
              return (
                <div
                  key={order.id}
                  className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-sm hover:border-neutral-300 transition-all space-y-4"
                >
                  {/* Top Bar: Order ID, Customer, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-extrabold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        {order.orderNumber}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-neutral-900">
                          {order.customerName}
                          {order.companyName && (
                            <span className="text-neutral-500 font-normal"> ({order.companyName})</span>
                          )}
                        </h4>
                        <p className="text-[11px] text-neutral-500">
                          {order.customerEmail} • {order.customerPhone}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${badge.bg} ${badge.text}`}>
                        {badge.label}
                      </span>

                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order, e.target.value as OrderRecord['status'])}
                        className="text-xs font-semibold bg-neutral-100 border border-neutral-300 rounded-lg px-2 py-1 text-neutral-900"
                      >
                        <option value="received">Set: Received</option>
                        <option value="in_production">Set: In Production</option>
                        <option value="printed">Set: Printed</option>
                        <option value="shipped">Set: Shipped</option>
                      </select>
                    </div>
                  </div>

                  {/* Middle: Product Specs & Quantity Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                        Garment & Customization
                      </span>
                      <div className="font-semibold text-neutral-900">{order.productName}</div>
                      <div className="text-neutral-500 mt-1 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full border border-neutral-300" style={{ backgroundColor: order.colorHex }} />
                        <span>{order.colorName}</span>
                        <span>•</span>
                        <span className="font-bold text-amber-700 uppercase">{order.printMethod}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                        Quantity & Size Breakdown ({order.orderType.toUpperCase()})
                      </span>
                      <div className="font-bold text-neutral-900">{order.totalQuantity} Total Pieces</div>
                      <div className="flex flex-wrap gap-1 mt-1 font-mono text-[11px] text-neutral-600">
                        {Object.entries(order.sizeBreakdown).map(([size, count]) =>
                          count > 0 ? (
                            <span key={size} className="bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
                              {size}:{count}
                            </span>
                          ) : null
                        )}
                      </div>
                    </div>

                    <div className="md:text-right">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block mb-0.5">
                        Financial Revenue
                      </span>
                      <div className="font-mono text-base font-extrabold text-amber-700">
                        ₹{order.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        ₹{order.unitPrice.toFixed(2)} / piece
                      </div>
                    </div>
                  </div>

                  {/* Bottom Actions: High-Res Print File Exporter */}
                  <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <div className="text-xs text-neutral-600 flex items-center gap-2">
                      <FileDown className="w-4 h-4 text-amber-600" />
                      <span>Download Print-Ready 300 DPI transparent graphics for DTF/Vinyl</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {order.frontLayers.length > 0 && (
                        <button
                          onClick={() => handleDownloadPrintFile(order, 'front')}
                          disabled={isExporting === `${order.id}-front`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          Front 300 DPI PNG
                        </button>
                      )}

                      {order.backLayers.length > 0 && (
                        <button
                          onClick={() => handleDownloadPrintFile(order, 'back')}
                          disabled={isExporting === `${order.id}-back`}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                        >
                          <Download className="w-3.5 h-3.5 text-amber-400" />
                          Back 300 DPI PNG
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
