import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  ProductItem,
  ColorVariant,
  PrintMethod,
  ViewSide,
  CanvasLayer,
  OrderType,
  SizeCode,
  SizeMatrix,
  OrderRecord,
} from '@/types/design';
import { PRODUCTS, COLOR_PALETTE, DISCOUNT_TIERS, PRINT_SIDE_SURCHARGE } from '@/data/products';

interface DesignStoreState {
  // Catalog Selection
  selectedProduct: ProductItem;
  selectedColor: ColorVariant;
  selectedView: ViewSide;
  selectedPrintMethod: PrintMethod;
  useHumanModelView: boolean;
  
  // Layer Canvas State
  frontLayers: CanvasLayer[];
  backLayers: CanvasLayer[];
  selectedLayerId: string | null;
  
  // Ordering & B2C/B2B Matrix
  orderType: OrderType;
  singleQuantity: number; // for B2C
  sizeMatrix: SizeMatrix; // for B2B
  
  // Customer Checkout Details
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName: string;
  
  // Persistent Orders List (Ginger Prints Admin Queue)
  orders: OrderRecord[];
  
  // Actions
  setSelectedProduct: (product: ProductItem) => void;
  setSelectedColor: (color: ColorVariant) => void;
  setSelectedView: (view: ViewSide) => void;
  setSelectedPrintMethod: (method: PrintMethod) => void;
  setSelectedLayerId: (id: string | null) => void;
  setUseHumanModelView: (modelView: boolean) => void;
  
  setOrderType: (type: OrderType) => void;
  setSingleQuantity: (qty: number) => void;
  setSizeMatrixCount: (size: SizeCode, count: number) => void;
  resetSizeMatrix: () => void;
  
  setCustomerDetails: (details: { name?: string; email?: string; phone?: string; company?: string }) => void;
  
  // Canvas Layer Manipulations
  addTextLayer: (text?: string, fontFamily?: string, fill?: string) => void;
  addImageLayer: (imageUrl: string, aspectRatio?: number) => void;
  updateLayer: (id: string, partial: Partial<CanvasLayer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  moveLayerDepth: (id: string, direction: 'up' | 'down') => void;
  clearCurrentViewLayers: () => void;
  toggleLayerBackgroundRemoved: (id: string) => void;
  
  // Computations
  getTotalQuantity: () => number;
  getDiscountPercent: () => number;
  getUnitPrice: () => number;
  getTotalPrice: () => number;
  
  // Admin & Order Fulfillment
  placeOrder: () => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void;
}

const DEFAULT_SIZE_MATRIX: SizeMatrix = {
  S: 5,
  M: 15,
  L: 20,
  XL: 10,
  '2XL': 0,
  '3XL': 0,
};

export const useDesignStore = create<DesignStoreState>()(
  persist(
    (set, get) => ({
      selectedProduct: PRODUCTS[0],
      selectedColor: COLOR_PALETTE[0],
      selectedView: 'front',
      selectedPrintMethod: 'dtf',
      useHumanModelView: false,
      
      frontLayers: [],
      backLayers: [],
      selectedLayerId: null,
      
      orderType: 'b2c',
      singleQuantity: 1,
      sizeMatrix: DEFAULT_SIZE_MATRIX,
      
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      companyName: '',
      
      orders: [
        {
          id: 'ord-demo-101',
          orderNumber: 'SG-8841',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          customerName: 'Aarav Sharma',
          customerEmail: 'aarav@jaipurtech.in',
          customerPhone: '+91 98290 12345',
          companyName: 'Jaipur Tech Solutions',
          orderType: 'b2b',
          productId: 'pique-polo',
          productName: 'Ginger Basics Executive Pique Polo',
          colorId: 'navy',
          colorName: 'Royal Navy',
          colorHex: '#0A192F',
          printMethod: 'embroidery',
          totalQuantity: 50,
          sizeBreakdown: { S: 5, M: 20, L: 20, XL: 5, '2XL': 0, '3XL': 0 },
          unitPrice: 21.00,
          totalPrice: 1050.00,
          frontLayers: [
            {
              id: 'layer-demo-1',
              type: 'text',
              view: 'front',
              x: 0.5,
              y: 0.5,
              width: 0.8,
              height: 0.4,
              rotation: 0,
              text: 'Jaipur Tech',
              fontFamily: 'Outfit',
              fontSize: 28,
              fill: '#FFFFFF',
              fontWeight: 'bold',
            }
          ],
          backLayers: [],
          status: 'in_production',
        }
      ],
      
      setSelectedProduct: (product) => {
        const defaultColor = product.availableColors.find(c => c.id === product.defaultColorId) || product.availableColors[0];
        const defaultMethod = product.supportedMethods[0] || 'dtf';
        set({
          selectedProduct: product,
          selectedColor: defaultColor,
          selectedPrintMethod: defaultMethod,
        });
      },
      
      setSelectedColor: (color) => set({ selectedColor: color }),
      setSelectedView: (view) => set({ selectedView: view, selectedLayerId: null }),
      setSelectedPrintMethod: (method) => set({ selectedPrintMethod: method }),
      setSelectedLayerId: (id) => set({ selectedLayerId: id }),
      setUseHumanModelView: (modelView) => set({ useHumanModelView: modelView }),
      
      setOrderType: (type) => set({ orderType: type }),
      setSingleQuantity: (qty) => set({ singleQuantity: Math.max(1, qty) }),
      setSizeMatrixCount: (size, count) => set((state) => ({
        sizeMatrix: {
          ...state.sizeMatrix,
          [size]: Math.max(0, count),
        }
      })),
      resetSizeMatrix: () => set({ sizeMatrix: { S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0 } }),
      
      setCustomerDetails: (details) => set((state) => ({
        customerName: details.name !== undefined ? details.name : state.customerName,
        customerEmail: details.email !== undefined ? details.email : state.customerEmail,
        customerPhone: details.phone !== undefined ? details.phone : state.customerPhone,
        companyName: details.company !== undefined ? details.company : state.companyName,
      })),
      
      addTextLayer: (text = 'YOUR TEXT HERE', fontFamily = 'Outfit', fill = '#111827') => {
        const state = get();
        const view = state.selectedView;
        const newLayer: CanvasLayer = {
          id: `layer-text-${Date.now()}`,
          type: 'text',
          view,
          x: 0.5, // Centered
          y: 0.4,
          width: 0.7,
          height: 0.25,
          rotation: 0,
          text,
          fontFamily,
          fontSize: 32,
          fill,
          fontWeight: 'bold',
          align: 'center',
          printMethod: state.selectedPrintMethod,
        };
        
        if (view === 'front') {
          set({ frontLayers: [...state.frontLayers, newLayer], selectedLayerId: newLayer.id });
        } else {
          set({ backLayers: [...state.backLayers, newLayer], selectedLayerId: newLayer.id });
        }
      },
      
      addImageLayer: (imageUrl, aspectRatio = 1.0) => {
        const state = get();
        const view = state.selectedView;
        const newLayer: CanvasLayer = {
          id: `layer-img-${Date.now()}`,
          type: 'image',
          view,
          x: 0.5,
          y: 0.5,
          width: 0.6,
          height: 0.6 / aspectRatio,
          rotation: 0,
          imageUrl,
          aspectRatio,
          isBackgroundRemoved: false,
          printMethod: state.selectedPrintMethod,
        };
        
        if (view === 'front') {
          set({ frontLayers: [...state.frontLayers, newLayer], selectedLayerId: newLayer.id });
        } else {
          set({ backLayers: [...state.backLayers, newLayer], selectedLayerId: newLayer.id });
        }
      },
      
      updateLayer: (id, partial) => {
        const state = get();
        const updateInList = (list: CanvasLayer[]) =>
          list.map((l) => (l.id === id ? { ...l, ...partial } : l));
          
        set({
          frontLayers: updateInList(state.frontLayers),
          backLayers: updateInList(state.backLayers),
        });
      },
      
      removeLayer: (id) => {
        const state = get();
        set({
          frontLayers: state.frontLayers.filter((l) => l.id !== id),
          backLayers: state.backLayers.filter((l) => l.id !== id),
          selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
        });
      },
      
      duplicateLayer: (id) => {
        const state = get();
        const target = [...state.frontLayers, ...state.backLayers].find((l) => l.id === id);
        if (!target) return;
        const newLayer: CanvasLayer = {
          ...target,
          id: `layer-dup-${Date.now()}`,
          x: Math.min(0.8, target.x + 0.05),
          y: Math.min(0.8, target.y + 0.05),
        };
        if (target.view === 'front') {
          set({ frontLayers: [...state.frontLayers, newLayer], selectedLayerId: newLayer.id });
        } else {
          set({ backLayers: [...state.backLayers, newLayer], selectedLayerId: newLayer.id });
        }
      },
      
      moveLayerDepth: (id, direction) => {
        const state = get();
        const view = state.selectedView;
        const layers = view === 'front' ? [...state.frontLayers] : [...state.backLayers];
        const index = layers.findIndex((l) => l.id === id);
        if (index === -1) return;
        
        if (direction === 'up' && index < layers.length - 1) {
          const temp = layers[index];
          layers[index] = layers[index + 1];
          layers[index + 1] = temp;
        } else if (direction === 'down' && index > 0) {
          const temp = layers[index];
          layers[index] = layers[index - 1];
          layers[index - 1] = temp;
        }
        
        if (view === 'front') {
          set({ frontLayers: layers });
        } else {
          set({ backLayers: layers });
        }
      },
      
      clearCurrentViewLayers: () => {
        const state = get();
        if (state.selectedView === 'front') {
          set({ frontLayers: [], selectedLayerId: null });
        } else {
          set({ backLayers: [], selectedLayerId: null });
        }
      },
      
      toggleLayerBackgroundRemoved: (id) => {
        const state = get();
        const findLayer = [...state.frontLayers, ...state.backLayers].find(l => l.id === id);
        if (findLayer) {
          state.updateLayer(id, { isBackgroundRemoved: !findLayer.isBackgroundRemoved });
        }
      },
      
      getTotalQuantity: () => {
        const state = get();
        if (state.orderType === 'b2c') {
          return state.singleQuantity;
        }
        return Object.values(state.sizeMatrix).reduce((sum, val) => sum + val, 0);
      },
      
      getDiscountPercent: () => {
        const qty = get().getTotalQuantity();
        const tier = DISCOUNT_TIERS.find(t => qty >= t.minQty && (t.maxQty === null || qty <= t.maxQty));
        return tier ? tier.discountPercent : 0;
      },
      
      getUnitPrice: () => {
        const state = get();
        const base = state.selectedProduct.basePrice;
        const discountPct = state.getDiscountPercent();
        
        // Print position surcharge
        const hasFront = state.frontLayers.length > 0;
        const hasBack = state.backLayers.length > 0;
        const surcharge = (hasFront && hasBack) ? PRINT_SIDE_SURCHARGE.bothSides : 0;
        
        const discountedBase = base * (1 - discountPct / 100);
        return Number((discountedBase + surcharge).toFixed(2));
      },
      
      getTotalPrice: () => {
        const qty = get().getTotalQuantity();
        const unitPrice = get().getUnitPrice();
        return Number((qty * unitPrice).toFixed(2));
      },
      
      placeOrder: () => {
        const state = get();
        const totalQty = state.getTotalQuantity();
        const unitPrice = state.getUnitPrice();
        const totalPrice = state.getTotalPrice();
        
        const newOrder: OrderRecord = {
          id: `ord-${Date.now()}`,
          orderNumber: `SG-${Math.floor(1000 + Math.random() * 9000)}`,
          createdAt: new Date().toISOString(),
          customerName: state.customerName || 'Walk-in Customer',
          customerEmail: state.customerEmail || 'customer@sweetginger.in',
          customerPhone: state.customerPhone || '+91 98000 00000',
          companyName: state.companyName || (state.orderType === 'b2b' ? 'B2B Wholesale Partner' : undefined),
          orderType: state.orderType,
          productId: state.selectedProduct.id,
          productName: state.selectedProduct.name,
          colorId: state.selectedColor.id,
          colorName: state.selectedColor.name,
          colorHex: state.selectedColor.hex,
          printMethod: state.selectedPrintMethod,
          totalQuantity: totalQty,
          sizeBreakdown: state.orderType === 'b2c' ? { S: 0, M: totalQty, L: 0, XL: 0, '2XL': 0, '3XL': 0 } : state.sizeMatrix,
          unitPrice,
          totalPrice,
          frontLayers: [...state.frontLayers],
          backLayers: [...state.backLayers],
          status: 'received',
        };
        
        set({
          orders: [newOrder, ...state.orders],
        });
        
        return newOrder;
      },
      
      updateOrderStatus: (orderId, status) => {
        set((state) => ({
          orders: state.orders.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)),
        }));
      },
    }),
    {
      name: 'sweet-ginger-design-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selectedProduct: state.selectedProduct,
        selectedColor: state.selectedColor,
        selectedView: state.selectedView,
        selectedPrintMethod: state.selectedPrintMethod,
        useHumanModelView: state.useHumanModelView,
        frontLayers: state.frontLayers,
        backLayers: state.backLayers,
        orderType: state.orderType,
        singleQuantity: state.singleQuantity,
        sizeMatrix: state.sizeMatrix,
        orders: state.orders,
      }),
    }
  )
);
