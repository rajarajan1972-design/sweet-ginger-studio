export type ProductCategory = 't-shirts' | 'hoodies' | 'caps';

export type GarmentType = 'crew-neck' | 'oversized' | 'polo' | 'hoodie' | 'zip-hoodie' | 'dad-cap';

export interface ColorVariant {
  id: string;
  name: string;
  hex: string;
  darkText?: boolean;
}

export interface PrintBoundary {
  x: number;      // Normalized 0.0 - 1.0 (relative to canvas width)
  y: number;      // Normalized 0.0 - 1.0 (relative to canvas height)
  width: number;  // Normalized 0.0 - 1.0
  height: number; // Normalized 0.0 - 1.0
  labelInches: string; // e.g. "12 x 16 in"
}

export type PrintMethod = 'dtf' | 'embroidery' | 'vinyl';

export type SizeCode = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL';

export type SizeMatrix = Record<SizeCode, number>;

export type ViewSide = 'front' | 'back';

export type LayerType = 'text' | 'image';

export interface CanvasLayer {
  id: string;
  type: LayerType;
  view: ViewSide;
  x: number;       // Normalized 0.0 - 1.0 within printable boundary
  y: number;       // Normalized 0.0 - 1.0 within printable boundary
  width: number;   // Normalized 0.0 - 1.0 relative to boundary width
  height: number;  // Normalized 0.0 - 1.0 relative to boundary height
  rotation: number; // 0 - 360 degrees
  
  // Text Properties
  text?: string;
  fontFamily?: string;
  fontSize?: number; // Base font size
  fill?: string;
  fontWeight?: string;
  fontStyle?: string;
  arc?: number; // Curving (-100 to 100)
  align?: 'left' | 'center' | 'right';
  
  // Image Properties
  imageUrl?: string;
  aspectRatio?: number;
  isBackgroundRemoved?: boolean;
  
  // Print technique tagging
  printMethod?: PrintMethod;
}

export type OrderType = 'b2c' | 'b2b';

export interface DiscountTier {
  minQty: number;
  maxQty: number | null; // null means infinity
  discountPercent: number;
  label: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  garmentType: GarmentType;
  description: string;
  basePrice: number; // B2C single unit base price in USD
  frontBoundary: PrintBoundary;
  backBoundary: PrintBoundary;
  availableColors: ColorVariant[];
  availableSizes: SizeCode[];
  defaultColorId: string;
  supportedMethods: PrintMethod[];
  svgPathFront: string;
  svgPathBack: string;
  modelImagePathFront?: string;
  modelImagePathBack?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  companyName?: string;
  orderType: OrderType;
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  colorHex: string;
  printMethod: PrintMethod;
  totalQuantity: number;
  sizeBreakdown: SizeMatrix;
  unitPrice: number;
  discountPercent?: number;
  totalPrice: number;
  frontLayers: CanvasLayer[];
  backLayers: CanvasLayer[];
  status: 'received' | 'in_production' | 'printed' | 'shipped';
  frontPrintDataUrl?: string;
  backPrintDataUrl?: string;
}
