# PRD: Greeting Card Creator

## Introduction
An interactive, client-side browser-based greeting card creator application. Users can upload custom images, crop them to various popular aspect ratios with drag-and-zoom positioning, add and customize multiple draggable and resizable text elements, choose beautiful typography, and export highly polished cards at various resolutions (social and print-ready). The application features a modern, high-end "glassmorphic" aesthetic with a vibrant ambient background inspired by modern dashboards (such as the EduMate layout).

## Goals
- Allow users to upload images and crop them to standard aspect ratios (1:1, 4:5, 9:16, 5:7) with interactive drag-and-zoom positioning.
- Provide a rich, Fabric.js-powered design canvas for adding and placing multiple styled text layers on top of the cropped image.
- Render high-quality typography using dynamically loaded Google Fonts with customizable variants (weight, style), size, and color.
- Support crisp, high-resolution outputs for both social sharing and printing (up to 300 DPI equivalent).
- Integrate native Web Share API to share cards seamlessly to WhatsApp and Instagram on mobile, with robust desktop download fallbacks.
- Deliver a premium visual experience inspired by modern dashboard designs (e.g., EduMate), utilizing glassmorphism and soft radial gradients.

## User Stories

### US-001: Project Setup and Infrastructure
**Description:** As a developer, I want to scaffold a React, Vite, TypeScript, and Tailwind CSS project with Fabric.js and Lucide React installed so I have a solid, modern environment to build the application.

**Acceptance Criteria:**
- [ ] Vite React TypeScript template initialized successfully.
- [ ] Tailwind CSS configured and integrated.
- [ ] `fabric` and `lucide-react` installed.
- [ ] Application compiles successfully with no lint or type errors.

### US-002: Step 1 - Image Upload and Interactive Cropping
**Description:** As a user, I want to upload an image and crop it to popular aspect ratios (1:1, 4:5, 9:16, 5:7) with smooth dragging so it fits my card design layout.

**Acceptance Criteria:**
- [ ] Drag-and-drop or file-selector input to upload images.
- [ ] Cropper interface with preset aspect ratios: 1:1, 4:5, 9:16, 5:7.
- [ ] User can drag the image within the cropping mask to adjust composition.
- [ ] "Apply Crop" button locks the cropped image and advances user to Step 2 (Design Canvas).
- [ ] Verify in browser.

### US-003: Step 2 - Fabric.js Interactive Design Canvas
**Description:** As a user, I want to see my cropped image on an interactive canvas and add/manipulate text overlays.

**Acceptance Criteria:**
- [ ] Cropped image rendered as the canvas background or base layer in Fabric.js.
- [ ] "Add Text" button creates a new editable text element on the canvas.
- [ ] Text layers can be freely dragged, scaled, and positioned anywhere on the canvas.
- [ ] Selection indicator shows active text element boundaries.
- [ ] Verify in browser.

### US-004: Text Styling & Google Fonts Panel
**Description:** As a user, I want to change the font, size, weight, style, and color of selected text elements.

**Acceptance Criteria:**
- [ ] Sidebar/toolbar control panel displayed when a text layer is selected.
- [ ] Dropdown featuring 10+ handpicked Google Fonts (e.g., Montserrat, Playfair Display, Great Vibes, Pacifico). Selected fonts load dynamically.
- [ ] Controls for font size, weight (Regular/Bold), style (Italic), and color (color picker).
- [ ] Customizations apply instantly to the active Fabric.js text object.
- [ ] Verify in browser.

### US-005: Hybrid Exporting & Presets
**Description:** As a user, I want to download my customized card in multiple sizes.

**Acceptance Criteria:**
- [ ] Export menu with options:
  - "Standard Digital" (1x canvas scale for fast sharing).
  - "High-Quality Print" (3x-4x canvas scale, preserving crisp vector-quality text and image details).
- [ ] Download triggers file saving of the PNG/JPEG with the correct aspect ratio.
- [ ] Export is processed completely in-browser using Fabric's multiplier scaling.
- [ ] Verify in browser.

### US-006: Social Sharing (Web Share & Fallbacks)
**Description:** As a user, I want to share my greeting card directly to WhatsApp or Instagram from my browser.

**Acceptance Criteria:**
- [ ] "Share Card" triggers the native Web Share API on supported devices, passing the generated image file.
- [ ] Supported mobile devices can share directly to WhatsApp or Instagram.
- [ ] Desktop/unsupported browsers fall back to showing a modal with:
  - A quick "Copy to Clipboard" button for the image.
  - A WhatsApp Web deep link.
  - Easy 1-click Download buttons with instruction tips.
- [ ] Verify in browser.

### US-007: Phase 2 - Templates & Layouts
**Description:** As a user, I want to choose from pre-designed templates to quickly create cards for specific occasions.

**Acceptance Criteria:**
- [ ] "Templates" entry point added to the sidebar (desktop) and the mobile bottom dock.
- [ ] Clicking a template populates the canvas with a curated, pre-positioned arrangement of text layers (background image is preserved).
- [ ] Templates are easy to customize further using the existing TextPanel (font, size, color, opacity, shadow, blend, position).
- [ ] Verify in browser.

**Scope & Decisions (from design session):**

- **Content (Q1):** A template is **text-only**. It contributes one or more `Textbox` overlays on top of the user's already-cropped background image. No shapes, no stickers, no background replacement.
- **Aspect-ratio handling (Q2):** Templates are **aspect-ratio-agnostic**. Every position and size is stored as a fraction of the virtual canvas (`leftFrac`, `topFrac`, `widthFrac`, and `fontSizeFrac` as fractions of canvas height) and resolved against the user's chosen aspect ratio at apply time.
- **Discovery & entry point (Q3):**
  - **Desktop:** A "Templates" icon button is added to the left `Sidebar` rail, placed **above** the existing "Text" button. Lucide icon: `LayoutTemplate`. Clicking it opens a **centered modal** (same pattern as `ShareModal`) with a thumbnail grid.
  - **Mobile:** A "Templates" pill is added to the bottom dock, alongside "Add text". Tapping it opens a **push-layout bottom sheet** with the same thumbnail grid (same pattern as the text-style sheet — flex sibling of fixed height, canvas shrinks above).
- **Replace-vs-keep behavior (Q4):** Applying a template:
  - If the canvas has **0 existing text layers**, apply silently (clobber nothing, just add the template's layers).
  - If the canvas has **≥1 existing text layer**, surface an **inline confirmation in the same modal/sheet** before applying: *"This will replace your N text layer(s). [Cancel] [Replace]"*. Always a replace operation — no "append" mode in Phase 2.
- **Template library (Q5):** Eight templates, one variant each:
  1. Birthday
  2. Thank You
  3. Congratulations
  4. Holiday Greetings
  5. Anniversary
  6. Get Well Soon
  7. With Love
  8. Hello
- **Thumbnails (Q6):** Each thumbnail is a **schematic preview** — a small card with a curated solid or gradient background color picked per occasion (no photo) on which the template's text is rendered in its actual fonts/sizes/colors. No live Fabric rendering of thumbnails, no pre-baked PNG assets in the repo.
- **Layer count (Q7):** Each template ships with **typically 2–3 text layers** providing visual hierarchy (e.g., headline + subtitle, optional tagline). Authoring constraint, not a hard limit.
- **Legibility defaults (Q8):** All template text layers default to **white fill** with the existing shadow preset (`rgba(0,0,0,0.5)`, blur `8`, offsetY `2`) **on by default**. Per-template accent colors are allowed where the design calls for it (e.g., gold "Anniversary" headline, soft red "Holiday").
- **Auto-open behavior:** Templates **do not auto-open** when the user enters the design step. The picker is opt-in via the sidebar button / mobile pill — the user sees their cropped image first.
- **Modal grid layout:** 2 columns on mobile sheet, 3 columns on desktop modal. Scroll vertically if content exceeds visible area.
- **Modal dismissal:** Modal closes automatically after a successful apply. Backdrop tap, X button, and Escape key dismiss without applying.

**Data model:**

Templates live as a typed TypeScript const array at `src/lib/templates.ts`. Shape:

```ts
export interface TemplateLayer {
  text: string;
  fontFamily: string;          // must exist in fontList.ts
  fontSizeFrac: number;        // fraction of canvas height (0..1)
  fontWeight?: 'normal' | 'bold';
  italic?: boolean;
  fill?: string;               // default '#ffffff'
  textAlign?: 'left' | 'center' | 'right'; // default 'center'
  leftFrac: number;            // 0..1
  topFrac: number;             // 0..1
  widthFrac: number;           // 0..1 — Textbox wrapping width
  opacity?: number;            // 0..1, default 1
  shadow?: boolean;            // default true
  blend?: 'normal' | 'multiply' | 'screen' | 'overlay'; // default 'normal'
}

export interface Template {
  id: string;                  // kebab-case
  name: string;                // display label
  thumbBg: string;             // CSS background (solid or gradient) for schematic preview
  layers: TemplateLayer[];
}
```

**Apply algorithm:**

1. Remove all existing `Textbox` objects from the canvas (after user confirms if any exist).
2. For each `TemplateLayer`, create a Fabric `Textbox` with:
   - `left = leftFrac * virtualWidth`, `top = topFrac * virtualHeight`, `originX/Y = 'center'`.
   - `width = widthFrac * virtualWidth`.
   - `fontSize = fontSizeFrac * virtualHeight` (rounded).
   - Font loaded via existing `loadGoogleFont(fontFamily)` before adding.
   - Shadow applied with the existing preset when `shadow !== false`.
3. `canvas.requestRenderAll()`. No active selection set (user sees the result laid out).

**New files / changes:**

- `src/lib/templates.ts` — type definitions + 8 template constants.
- `src/lib/applyTemplate.ts` — `applyTemplate(canvas, template, virtualWidth, virtualHeight)` helper, mirroring `addText.ts`.
- `src/components/TemplatesModal.tsx` — desktop centered modal with grid + inline confirm.
- `src/components/TemplateThumb.tsx` — schematic preview card used by modal + mobile sheet.
- `src/components/Sidebar.tsx` — add Templates button above Text button.
- `src/components/DesignStep.tsx` — wire modal open/close state, render mobile sheet variant alongside existing text-style sheet, add Templates pill to dock.

## Functional Requirements

- **FR-1:** Standardized aspect ratio options: 1:1 (Square), 4:5 (Portrait), 9:16 (Story), 5:7 (Classic Card).
- **FR-2:** Image drag and scroll-to-zoom positioning during the Cropping Step.
- **FR-3:** Ability to add multiple text boxes.
- **FR-4:** Drag, delete, and resize handles on text elements.
- **FR-5:** Dynamic font family loaders that request Google Fonts as needed.
- **FR-6:** High-resolution multiplier output mapping: up to 3000px resolution on exports.
- **FR-7:** Responsive visual design optimizing desktop workspace and mobile edit flows.
- **FR-8:** Ambient background that dynamically reflects the card's colors or maintains a beautiful static gradient.

## Non-Goals
- No backend server, cloud storage, or databases.
- No user authentication or saving user project states in the cloud.
- No direct Instagram API post automation (must use native device sharing or manual uploads).
- No complicated image filters (grayscale, sepia, etc.) - focus is on cropping and text design.
- **No template system in Phase 1 (postponed to Phase 2 once core workflows are validated).**

## Design Considerations

### Visual Identity (EduMate-inspired)
- **Style:** Glassmorphism (semi-transparent containers, `backdrop-blur-md`, subtle translucent white borders).
- **Color Palette:** Vibrant, soft radial gradients (pinks, purples, blues) for the ambient background.
- **Accent Color:** High-contrast Royal Blue (`#0066FF`) for active states and primary buttons.
- **Layout:** Left-hand sidebar navigation for tools/templates, large central glassmorphic workspace for the canvas.
- **Components:** High rounded corners (`rounded-2xl` or `rounded-3xl`) on all card and container elements.

### UI/UX
- Smooth, high-performance interactions for dragging and zooming.
- Clear, intuitive step-by-step workflow (Step 1: Upload & Crop $\rightarrow$ Step 2: Decorate & Export).

## Technical Considerations
- Fabric.js (`v5` or `v6`) for managing canvas objects and multi-resolution rendering.
- Web Share API (`navigator.share` / `navigator.canShare`) used for direct image transfer.
- Canvas dimensions auto-fit screen while preserving canvas aspect ratio internally.

## Success Metrics
- Fully client-side creation and export in <60 seconds.
- Exported images display crisp text even at 3x resolutions.
- 100% responsive design working on mobile, tablet, and desktop viewports.
