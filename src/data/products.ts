import { ProductItem, DiscountTier, ColorVariant } from '@/types/design';

export const COLOR_PALETTE: ColorVariant[] = [
  { id: 'white', name: 'Bright White', hex: '#FFFFFF', darkText: true },
  { id: 'black', name: 'Jet Black', hex: '#121212' },
  { id: 'navy', name: 'Royal Navy', hex: '#0A192F' },
  { id: 'heather-grey', name: 'Heather Grey', hex: '#9CA3AF', darkText: true },
  { id: 'emerald', name: 'Jaipur Emerald', hex: '#065F46' },
  { id: 'crimson', name: 'Royal Crimson', hex: '#991B1B' },
  { id: 'amber', name: 'Jaipur Amber Gold', hex: '#D97706' },
  { id: 'sand', name: 'Desert Sand', hex: '#D7C4B7', darkText: true },
];

export const DISCOUNT_TIERS: DiscountTier[] = [
  { minQty: 1, maxQty: 5, discountPercent: 0, label: 'Standard Retail' },
  { minQty: 6, maxQty: 24, discountPercent: 10, label: 'Small Team (10% OFF)' },
  { minQty: 25, maxQty: 99, discountPercent: 25, label: 'Bulk Wholesale (25% OFF)' },
  { minQty: 100, maxQty: null, discountPercent: 40, label: 'Mega Fleet (40% OFF)' },
];

export const PRINT_SIDE_SURCHARGE = {
  frontOnly: 0,
  backOnly: 0,
  bothSides: 199.00, // ₹199 extra when both Front and Back sides are customized
};

export const PRODUCTS: ProductItem[] = [
  {
    id: 'crew-neck-tee',
    name: 'Sweet Ginger Classic Crew Neck Tee',
    category: 't-shirts',
    garmentType: 'crew-neck',
    description: 'Premium 180 GSM combed cotton. Soft hand-feel, ideal for DTF prints, screen printing, and custom embroidery.',
    basePrice: 499.00, // ₹499 INR
    defaultColorId: 'white',
    availableColors: COLOR_PALETTE,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    supportedMethods: ['dtf', 'embroidery', 'vinyl'],
    modelImagePathFront: '/models/tshirt_model_front.png',
    frontBoundary: {
      x: 0.35,
      y: 0.28,
      width: 0.30,
      height: 0.24,
      labelInches: '12 x 16 in (Chest)',
    },
    backBoundary: {
      x: 0.35,
      y: 0.26,
      width: 0.30,
      height: 0.26,
      labelInches: '12 x 16 in (Upper Back)',
    },
    svgPathFront: 'M 50 12 C 38 12 28 20 12 26 C 8 28 4 40 8 52 L 20 52 L 20 125 C 20 130 80 130 80 125 L 80 52 L 92 52 C 96 40 92 28 88 26 C 72 20 62 12 50 12 Z',
    svgPathBack: 'M 50 12 C 38 12 28 20 12 26 C 8 28 4 40 8 52 L 20 52 L 20 125 C 20 130 80 130 80 125 L 80 52 L 92 52 C 96 40 92 28 88 26 C 72 20 62 12 50 12 Z',
  },
  {
    id: 'oversized-tee',
    name: 'Sweet Ginger Heavyweight Oversized Tee',
    category: 't-shirts',
    garmentType: 'oversized',
    description: 'Streetwear 240 GSM heavy cotton tee with dropped shoulders and relaxed fit.',
    basePrice: 799.00, // ₹799 INR
    defaultColorId: 'black',
    availableColors: COLOR_PALETTE,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    supportedMethods: ['dtf', 'embroidery', 'vinyl'],
    modelImagePathFront: '/models/tshirt_model_front.png',
    frontBoundary: {
      x: 0.34,
      y: 0.28,
      width: 0.32,
      height: 0.26,
      labelInches: '14 x 18 in (Center Chest)',
    },
    backBoundary: {
      x: 0.34,
      y: 0.26,
      width: 0.32,
      height: 0.28,
      labelInches: '14 x 18 in (Poster Back)',
    },
    svgPathFront: 'M 50 10 C 35 10 22 18 4 25 C 0 28 0 48 4 60 L 16 60 L 16 128 C 16 133 84 133 84 128 L 84 60 L 96 60 C 100 48 100 28 96 25 C 78 18 65 10 50 10 Z',
    svgPathBack: 'M 50 10 C 35 10 22 18 4 25 C 0 28 0 48 4 60 L 16 60 L 16 128 C 16 133 84 133 84 128 L 84 60 L 96 60 C 100 48 100 28 96 25 C 78 18 65 10 50 10 Z',
  },
  {
    id: 'pique-polo',
    name: 'Ginger Basics Executive Pique Polo',
    category: 't-shirts',
    garmentType: 'polo',
    description: '220 GSM pique cotton with collar, button placket, and ribbed cuffs. Optimized for corporate logo embroidery.',
    basePrice: 899.00, // ₹899 INR
    defaultColorId: 'navy',
    availableColors: COLOR_PALETTE,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    supportedMethods: ['embroidery', 'dtf'],
    modelImagePathFront: '/models/polo_model_front.png',
    frontBoundary: {
      x: 0.54,
      y: 0.28,
      width: 0.16,
      height: 0.16,
      labelInches: '4 x 4 in (Left Chest)',
    },
    backBoundary: {
      x: 0.35,
      y: 0.28,
      width: 0.30,
      height: 0.26,
      labelInches: '12 x 16 in (Full Back)',
    },
    svgPathFront: 'M 50 14 C 38 14 28 22 12 28 C 8 30 5 44 8 54 L 20 54 L 20 125 C 20 130 80 130 80 125 L 80 54 L 92 54 C 95 44 92 30 88 28 C 72 22 62 14 50 14 Z',
    svgPathBack: 'M 50 14 C 38 14 28 22 12 28 C 8 30 5 44 8 54 L 20 54 L 20 125 C 20 130 80 130 80 125 L 80 54 L 92 54 C 95 44 92 30 88 28 C 72 22 62 14 50 14 Z',
  },
  {
    id: 'fleece-hoodie',
    name: 'Sweet Ginger Heavy Fleece Pullover Hoodie',
    category: 'hoodies',
    garmentType: 'hoodie',
    description: '350 GSM ultra-warm brushed fleece with double-lined hood and kangaroo pouch pocket.',
    basePrice: 1499.00, // ₹1,499 INR
    defaultColorId: 'black',
    availableColors: COLOR_PALETTE,
    availableSizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
    supportedMethods: ['dtf', 'embroidery', 'vinyl'],
    modelImagePathFront: '/models/hoodie_model_front.png',
    frontBoundary: {
      x: 0.34,
      y: 0.34,
      width: 0.32,
      height: 0.22,
      labelInches: '12 x 12 in (Front Chest)',
    },
    backBoundary: {
      x: 0.34,
      y: 0.30,
      width: 0.32,
      height: 0.26,
      labelInches: '14 x 18 in (Center Back)',
    },
    svgPathFront: 'M 50 4 C 34 4 22 14 8 24 C 4 26 2 42 6 56 L 18 56 L 18 126 C 18 132 82 132 82 126 L 82 56 L 94 56 C 98 42 96 26 92 24 C 78 14 66 4 50 4 Z',
    svgPathBack: 'M 50 4 C 34 4 22 14 8 24 C 4 26 2 42 6 56 L 18 56 L 18 126 C 18 132 82 132 82 126 L 82 56 L 94 56 C 98 42 96 26 92 24 C 78 14 66 4 50 4 Z',
  },
  {
    id: 'dad-cap',
    name: 'Ginger Prints Heritage Cotton Dad Cap',
    category: 'caps',
    garmentType: 'dad-cap',
    description: 'Unstructured 6-panel bio-washed cotton cap with brass buckle strap. Perfect for embroidered logos.',
    basePrice: 399.00, // ₹399 INR
    defaultColorId: 'black',
    availableColors: COLOR_PALETTE,
    availableSizes: ['M', 'L'],
    supportedMethods: ['embroidery', 'dtf', 'vinyl'],
    modelImagePathFront: '/models/cap_model_front.png',
    frontBoundary: {
      x: 0.36,
      y: 0.26,
      width: 0.28,
      height: 0.20,
      labelInches: '4 x 2.2 in (Front Crown)',
    },
    backBoundary: {
      x: 0.38,
      y: 0.26,
      width: 0.24,
      height: 0.18,
      labelInches: '3 x 1.5 in (Above Strap)',
    },
    svgPathFront: 'M 15 65 Q 50 15 85 65 Q 98 68 98 78 Q 50 100 2 78 Q 2 68 15 65 Z',
    svgPathBack: 'M 15 65 Q 50 20 85 65 Q 92 70 92 78 C 80 88 65 88 50 88 C 35 88 20 88 8 78 Q 8 70 15 65 Z',
  },
];
