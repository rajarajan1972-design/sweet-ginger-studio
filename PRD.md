# Product Requirements Document (PRD): Sweet Ginger Custom T-Shirt Design System

## 1. The Client, in Five Lines

* **Client**: Shankar Hemrajani, founder and CEO of Sweet Ginger Fashions in Jaipur, built over 17+ years from a single 150 sq ft T-shirt outlet.
* **Operations**: Operates three distinct verticals: **Sweet Ginger Basics** (B2B wholesale blanks), **The T-Shirt Shop** (retail D2C store), and **Ginger Prints** (custom printing shop).
* **Catalog**: Plain T-shirts (crew, oversized, polo), hoodies, sweatshirts, caps, and customized printed/embroidered apparel.
* **Current Workflow**: Every custom apparel order relies on manual, slow back-and-forth communication over WhatsApp and email.
* **Core Goal**: A self-service customizable T-shirt design system for single B2C orders and B2B bulk orders to eliminate manual order intake bottlenecks.

---

## 2. What They Said, and What It Means for the Build

| Direct Quote from Transcript | What It Means for the Build (Problem & Operational Requirement) |
| :--- | :--- |
| `"Today every custom order is a slow back and forth over WhatsApp and email."` | The current intake process is synchronous and unscalable. The system must capture all design specifications, print positions, garment attributes, and artwork files self-service at checkout without requiring human staff intervention. |
| `"Take the shape from CustomInk: choose a product, add text or upload artwork, move and size it on the shirt, pick colour and size, watch the price update, and check out."` | The product requires a single-screen design lab flow where product selection, canvas manipulation, live pricing recalculation, and checkout are seamlessly connected. |
| `"Both a single B2C order and a B2B bulk order should work."` | The ordering engine must handle two different purchasing behaviors: single-item retail purchases (1-click quantity) and B2B wholesale orders (multi-size quantity matrix with volume discounts). |
| `"Support front and back of the shirt, and a print area the design cannot leave."` | The canvas must enforce physical printable boundaries per garment side (Front/Back) and prevent artwork or text from overflowing outside printable bounds. |
| `"An order always carries its design; an order without artwork is not printable."` | Order placement must strictly enforce design attachment. The system must reject any order payload that lacks structured design coordinates and downloadable source artwork files. |
| `"A list of orders with the design attached, and a way to download the artwork or a print-ready file for DTF, embroidery or vinyl."` | The admin panel is a production queue for Ginger Prints staff. Operators must be able to export high-resolution artwork formatted for three distinct print production techniques. |
| `"Mark an order as in production, printed, shipped."` | The system must include an operational order status state machine (`Received` -> `In Production` -> `Printed` -> `Shipped`) to provide fulfillment visibility. |
| `"Which vertical leads the first version: The T-Shirt Shop (retail, single orders) or Sweet Ginger Basics (B2B bulk)?"` | The client recognizes a strategic tension between retail D2C and wholesale B2B requirements and needs an architecture that resolves both without compromising user experience. |
| `"Which print method the order is for (DTF, embroidery, vinyl) and whether that changes the design tool."` | Different print techniques carry physical artwork restrictions (e.g., embroidery requires thread color limits; vinyl requires vector cut paths). The tool must communicate print method constraints to the user. |

---

## 3. Problems Ranked by Business Cost

### Cost #1: Unprintable Artwork & Manual Pre-press Cleanup (Highest Cost)
When customers send low-resolution images, copyrighted graphics, or missing background files via WhatsApp, Ginger Prints operators spend hours cleaning files or re-contacting customers. Bad artwork results in wasted garments, ruined prints, and delayed production runs.

### Cost #2: Manual WhatsApp/Email Intake Bottleneck (High Cost)
Handling custom orders manually over messaging channels limits daily order volume to staff chat capacity. Slow response times during peak corporate gifting and event seasons lead to abandoned orders and lost revenue.

### Cost #3: Friction in Calculating B2B Bulk Matrix Pricing (Medium-High Cost)
B2B clients purchasing 500 shirts across 5 sizes and 3 colors cannot calculate volume discounts or submit multi-size breakdowns independently, forcing manual price quoting and delaying order confirmation.

### Cost #4: Customer Status Inquiries & Support Overhead (Medium Cost)
Customers repeatedly messaging on WhatsApp to ask whether their order is printed or shipped consumes staff time that should be spent producing garments.

---

## 4. What Does NOT Add Up (Objections & Contradictions)

### Strongest Objection: Merging B2C Retail and B2B Wholesale into a Single Design Studio UI Will Degrade Experience for Both

Your plan to combine single-item retail D2C orders and complex B2B wholesale matrix orders into one unified canvas UI will confuse retail buyers and frustrate B2B procurement managers. 

A retail customer buying 1 custom T-shirt wants a simple 3-step experience (Pick shirt -> Add graphic -> Buy). A B2B corporate buyer purchasing 500 polo shirts needs size distribution matrices (S–3XL), volume pricing break tables, purchase order references, tax IDs, and strict print technique selections (Embroidery vs. DTF). Forcing both into the exact same screen creates a cluttered, confusing tool for retail buyers while lacking the structured procurement tools required by B2B clients.

### Contradiction: AI Text-to-Image Generation Does NOT Produce "Print-Ready Files for DTF, Embroidery, or Vinyl"

The transcript asks to `"Generate a design from a text prompt, and remove the background from an uploaded image (this is what Drop Studio does)"` and simultaneously demands `"a way to download the artwork or a print-ready file for DTF, embroidery or vinyl."`

This is a major technical contradiction:
* AI text-to-image prompt generation outputs low-resolution 72 DPI RGB raster images.
* **DTF printing** requires high-resolution 300 DPI CMYK transparent PNGs.
* **Embroidery** requires digitized vector stitch paths (`.DST` / `.PES` files).
* **Vinyl cutting** requires vector stroke paths (`.SVG` / `.EPS` files).

Allowing customers to generate AI images and assuming they are "print-ready" for embroidery or vinyl without manual vectorization and stitch digitizing will produce unprintable files that break shop operations.

### Not a Software Problem: Customer Back-and-Forth on WhatsApp Is Driven by Trust, Advice, and Proofs, Not Just a Missing Canvas

The quote states: `"Today every custom order is a slow back and forth over WhatsApp and email."`

Assuming a self-service web canvas will completely eliminate WhatsApp communication misdiagnoses the problem. In custom apparel, customers reach out on WhatsApp to negotiate pricing, ask for physical fabric samples, confirm delivery deadlines for events, and request digital proofs before paying. Software can automate intake for standard orders, but customer reassurance and proofing remain human/process interactions.

---

## 5. Explicitly Out of Scope

1. **Automated Vector Stitch Digitizing for Embroidery**: Converting uploaded raster files or AI images into machine embroidery stitch paths (`.DST`/`.PES`) requires specialized CAD software or manual digitizer work. The studio will store high-res graphics, but full embroidery digitizing remains a manual pre-press step.
2. **Full ERP & Multi-Store Inventory Synchronization**: Real-time stock sync across physical Jaipur retail outlets and wholesale warehouse inventory is excluded from the initial design studio scope.
3. **Third-Party Marketplace / Multi-Vendor Printing**: The system is exclusively for Sweet Ginger Fashions products and Ginger Prints fulfillment.

---

## 6. Open Questions to Resolve Before Building

1. **Primary Launch Focus**: Should the initial release prioritize D2C Retail (The T-Shirt Shop) or B2B Wholesale (Sweet Ginger Basics) as the primary user flow?
2. **Bulk Pricing Matrix**: What are the exact volume discount threshold numbers (e.g., 1–5, 6–24, 25–99, 100+ pcs) and per-side print surcharges?
3. **Print Boundary Specs**: What are the exact physical printable dimensions in inches ($12'' \times 16''$ chest, $4'' \times 4''$ pocket/cap) for each product model?
4. **Print Method Constraints**: Should the canvas restrict design features based on selected print method (e.g., disabling gradients for Vinyl or limiting text size for Embroidery)?
5. **Artwork DPI Validation**: Should the canvas reject image uploads below 300 DPI automatically, or flag them in the admin queue for operator review?
