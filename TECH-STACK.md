# Technology Stack Specification: Sweet Ginger Custom T-Shirt Design Studio

## Staff Engineer's Advisory Note

> [!WARNING]
> **Constraint Critique**: Requiring a single system to handle both **B2C retail single orders** and **B2B wholesale bulk matrix orders** forces the state engine to maintain complex size breakdown arrays (`Record<Size, Quantity>`) alongside simple scalar quantities (`number`). To keep this maintainable for junior developers, the architecture explicitly separates the UI presentation layer while keeping a single unified state store. Additionally, requiring AI image generation while mandating total uptime when AI providers fail means AI features are isolated as non-blocking enhancements with local canvas fallbacks.

---

## Technical Stack Choices

| LAYER | CHOICE | THE CONSTRAINT THAT FORCED IT |
| :--- | :--- | :--- |
| **Framework & Server Operations** | **Next.js (App Router, React 19, TypeScript)** | Dual requirements for customer-facing canvas UI, B2B matrix calculations, admin order management, and serverless API endpoints for print asset downloads in a single unified deployable codebase on Vercel.<br>*Rejected*: Vite SPA + Express (requires managing two deployments, CORS config, and dual environment setups for junior maintainers). |
| **2D Design Canvas Engine** | **Konva.js (`react-konva`)** | Must support multi-layer text/image positioning, rotation, scale, front/back switching, printable boundary enforcement, crisp 300 DPI canvas exports, and touch gestures on 375px mobile screens.<br>*Rejected*: Fabric.js (heavier bundle size, legacy event loop, buggy touch handling on modern mobile browsers). |
| **State Management** | **Zustand** | Canvas elements (text, fonts, positions, layers), garment selection, size matrix counts, and live pricing state must persist seamlessly during color/product changes without triggering full React component tree re-renders during high-frequency drag operations.<br>*Rejected*: Redux Toolkit (excessive boilerplate for simple maintainability) & React Context (causes frame drops during 60fps canvas dragging). |
| **Styling & Responsiveness** | **Tailwind CSS + Vanilla CSS Modules** | PRD requirement for Jaipur brand aesthetics (Outfit/Inter fonts, curated palette) and 375px mobile touch target optimization ($\ge 44\text{ px}$) without runtime CSS injection overhead.<br>*Rejected*: Styled-Components / Emotion (dynamic stylesheet injection causes noticeable lag during canvas mousemove/touchmove events). |
| **Local Image Processing & Background Removal** | **HTML5 Canvas Native ImageData Processing (`getImageData` / Chroma Key)** | Non-negotiable constraint: *"Must stay usable when every AI provider is rate limited or down"*. Local canvas pixel thresholding removes white/solid backgrounds instantly in-browser with zero network latency or API costs.<br>*Rejected*: Cloud-only AI background removal APIs as a hard requirement (crashes order flow when API key quota or rate limits hit). |
| **Optional AI Generation Fallback** | **HuggingFace Inference API + Local Vector Clip-Art Library** | Non-negotiable constraint: *"Must stay usable when every AI provider is rate limited or down"*. When AI text-to-image is unavailable or rate-limited, the system seamlessly falls back to a categorized SVG clip-art asset gallery.<br>*Rejected*: Direct reliance on OpenAI DALL-E 3 (unmaintained third-party credit dependency that breaks app availability upon quota exhaustion). |
| **Database & File Storage** | **Supabase (PostgreSQL + Supabase Storage)** | Structured JSON design payload storage (coordinates, text, fonts, quantity breakdown arrays) linked directly to order records, plus secure public asset URLs for uploaded customer artwork.<br>*Rejected*: MongoDB (lacks relational integrity between B2B order line items, pricing tiers, and production queue status states). |
| **High-Res Print Asset Generator** | **Native HTML5 Canvas Export ($4\times$ Scale, $300\text{ DPI}$ equivalent PNG)** | PRD Requirement: *"download the artwork or a print-ready file for DTF"*. Exports transparent, uncompressed $300\text{ DPI}$ PNG assets ($3600 \times 4800\text{ px}$) rendered directly from stored JSON design coordinates.<br>*Rejected*: Server-side Puppeteer PDF rendering (heavy server memory footprint, slow rendering times, prone to Node process crashes). |

---

## Hard Exclusions

The codebase and build process must **NOT** use any of the following libraries or architectural patterns:

### 1. Fabric.js
* **Reason**: Large bundle size ($>300\text{ KB}$ gzipped), outdated codebase architecture, and well-documented touch-event inconsistencies on modern iOS/Android mobile browsers. `react-konva` is lighter, fully declarative in React, and handles touch gestures reliably.

### 2. Runtime CSS-in-JS (Styled-Components, Emotion)
* **Reason**: Injecting dynamic `<style>` tags during continuous mouse/touch drag events causes layout recalibration and frame dropping ($<30\text{ fps}$). All UI components must use static Tailwind utility classes or CSS Modules.

### 3. Heavy Enterprise UI Frameworks (Material UI, Ant Design)
* **Reason**: Overwrites custom Jaipur brand aesthetic tokens, inflates initial bundle size by $>400\text{ KB}$, and introduces deep component wrapper trees that complicate maintenance for junior developers.

### 4. Direct Client-Side AI API Calls with Exposed Keys
* **Reason**: Violates security rules (exposes secret API keys in client JavaScript bundles) and breaks the offline/resilience requirement. All AI calls must pass through serverless API proxy routes with fallback triggers.

### 5. Server-Side Headless Browser Rendering (Puppeteer / Playwright for Print Export)
* **Reason**: Spawns heavy Chromium processes on serverless instances, leading to memory exhaustion, long cold-start delays, and high infrastructure costs. High-res print file generation must be calculated natively via canvas scale rendering.
