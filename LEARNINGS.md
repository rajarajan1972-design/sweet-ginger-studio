# Engineering Learnings & Reference Playbook

This document captures architecture patterns, debugging findings, and operational lessons discovered during the development and deployment of the **Sweet Ginger Custom Apparel Design Studio**. 

These learnings serve as a reference for future projects involving Next.js App Router, interactive canvas design engines, real-time pricing calculators, and Vercel cloud deployments.

---

## 1. Package Management & CI/CD

### Bleeding-Edge React 19 & Peer Dependencies (`.npmrc`)
* **Context**: When using React 19 with ecosystem libraries like `react-konva@19.3.0` or specialized animation/canvas packages, libraries may declare strict peer dependencies on specific minor/patch versions of React.
* **Failure Mode**: Local installs may pass with `--legacy-peer-deps`, but Vercel's automated CI/CD runs standard `npm install` without flags, failing with:
  ```text
  npm error ERESOLVE could not resolve
  npm error Conflicting peer dependency: react@19.3.0 from react-konva@19.3.0
  ```
* **Solution**: Add an `.npmrc` file directly in the repository root:
  ```ini
  legacy-peer-deps=true
  ```
  This ensures local machines, Docker, GitHub Actions, and Vercel build environments consistently resolve dependencies without manual intervention.

---

## 2. Interactive Canvas & Graphics Architecture

### SSR Isolation for Canvas Engines
* **Context**: Interactive design canvases depend on DOM and browser canvas APIs (`window`, `document`, HTML5 `<canvas>`, `Konva`).
* **Failure Mode**: Next.js App Router prerenders static pages by default during `npm run build`. Attempting to render canvas components on the server triggers `ReferenceError: window is not defined` or hydration mismatch warnings.
* **Solution**:
  * Isolate all canvas manipulation code inside client components (`'use client'`).
  * Always load the canvas component into parent pages using Next.js `dynamic(..., { ssr: false })` with a pulse/skeleton placeholder.

### Normalized Coordinates (`0.0 - 1.0` Unit Space)
* **Context**: Canvas elements must render consistently across multiple viewports (e.g. mobile 390px vs desktop 1440px) and export cleanly to physical print files ($3600 \times 4800\text{ px}$ @ 300 DPI).
* **Failure Mode**: Storing element positions, dimensions, or font sizes as absolute pixels (e.g., $x=200\text{px}, y=150\text{px}$) warps or misaligns designs when screen sizes change or when exporting.
* **Solution**:
  * Store all coordinates as floating point percentages ($0.0 \text{ to } 1.0$) relative to the garment's printable bounding box.
  * Compute screen display coordinates by multiplying normalized values by the stage dimensions.
  * Compute production print coordinates by multiplying the exact same normalized values by the $3600 \times 4800\text{ px}$ target canvas.

### Physical Printable Boundary Enforcement
* **Context**: Garment printers have physical print margins (e.g. maximum $12'' \times 16''$ on a chest, or $4'' \times 4''$ on a cap crown).
* **Finding**: Users often drag designs close to or over the edges. Adding an active boundary detection formula:
  $$\text{isNearMargin} = (x < 0.12 \lor x > 0.88 \lor y < 0.12 \lor y > 0.88)$$
  allows the UI to gently shift boundary stroke colors (e.g., amber dashed lines) and display a non-blocking `⚠️ Near Margin` indicator before checkout.

---

## 3. UI/UX Design & CSS Edge Cases

### Floating Action Toolbars & Sizing
* **Context**: Floating status pills and contextual action bars positioned over canvases (e.g. `bottom-3 left-1/2 -translate-x-1/2`).
* **Failure Mode**:
  * Using `w-auto` with `shrink-0` on inner flex items can cause content (like color swatches) to poke through the curved edges of rounded pills.
  * Long dynamic text (e.g., product titles) can crowd out action buttons.
* **Solution**:
  * Use `w-fit` with `max-w-[95%]` and `rounded-full` with balanced padding (`px-4 py-2`).
  * Wrap dynamic product titles in `truncate max-w-[120px] sm:max-w-[200px]`.

### Global Scrollbar Leakage into Inline Elements
* **Context**: Customizing webkit scrollbars globally (`::-webkit-scrollbar` in `globals.css`) causes any child container with `overflow-x-auto` to render a visible scrollbar track and thumb.
* **Failure Mode**: On narrow screens, a tiny gray scrollbar handle can appear inside floating pills and navigation swatches.
* **Solution**: Define a dedicated `.no-scrollbar` utility in `globals.css` and apply it to inline pill containers:
  ```css
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  ```

---

## 4. Backend & Decoupled Service Architecture

### Resilient Serverless Email Pipeline (Dual-Mode Delivery)
* **Context**: E-commerce and design systems require automated order receipts and status change notifications.
* **Failure Mode**: Tight-coupling an external email provider directly to checkout code causes build failures or runtime crashes in environments where SMTP or API keys are not yet configured.
* **Solution**:
  * Route all notifications through a dedicated Next.js API route (`/api/orders/email`).
  * Implement dual-mode transport in the service layer:
    1. **Live Mode**: When `SMTP_*` variables exist in `.env.local`, dispatch real emails via `nodemailer`.
    2. **Simulation Mode**: When credentials are not yet configured, log the structured order receipt to the server console and return `{ success: true, simulated: true }`.
  * Always provide an committed `.env.example` documenting required environment variables for production onboarding.

---

## 5. Vercel & GitHub Deployment Gotchas

### Repository Provisioning & "Already Exists" Errors
* **Context**: Deploying a repository via Vercel's clone URL template (`vercel.com/new/clone?repository-url=...`).
* **Failure Mode**: If the repository was already created and pushed under your GitHub account, Vercel cannot clone it as a *new* repository with the same name, displaying:
  ```text
  A repository named "..." already exists. Choose a different name.
  ```
* **Solution**: Navigate directly to `vercel.com/new` and use **"Import Existing Repository"** instead of the clone template.

### Missing Repositories in Vercel Import List
* **Context**: A freshly pushed GitHub repository does not appear in the Vercel "Import Git Repository" list.
* **Failure Mode**: The Vercel GitHub App was previously configured with access limited to "Only select repositories" rather than "All repositories".
* **Solution**:
  * Click **"Adjust GitHub App Permissions"** at the bottom of the Vercel import screen.
  * Under **"Repository access"**, select the new repository and save.

---

## 6. Windows PowerShell Tooling Quirks

### Command Chaining Syntax
* **Failure Mode**: Running Bash-style chained commands (`git add . && git commit -m "..."`) in Windows PowerShell results in:
  ```text
  ParserError: The token '&&' is not a valid statement separator in this version.
  ```
* **Solution**: Use semicolons (`;`) as the statement separator in PowerShell (`git add .; git commit -m "..."`).
