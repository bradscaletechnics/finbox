

# PDF Export (Offline-Ready)

## Approach
Use the browser's native `window.print()` API, which works completely offline with no dependencies. The Handoff Package page already looks like a printable document, so we just need print-specific CSS to hide UI chrome and wire up the buttons.

## Changes

### 1. Print Styles in `src/index.css`
Add a `@media print` block that:
- Hides the sticky action bar (Back/Download/Send buttons), the TitleBar, TopBar, and StatusBar
- Removes the gray page background, leaving only the white document
- Strips box shadows and rounds
- Sets `@page` margins for clean output
- Marks the document container as full-width with no outer spacing

### 2. Wire "Download PDF" button in `src/pages/HandoffPackage.tsx`
- Add `onClick={() => window.print()}` to the existing "Download PDF" button
- The browser opens its native print dialog where the user picks "Save as PDF" (works offline on every OS)

### 3. Wire "Export to PDF" button in `src/components/discovery/steps/ReviewSummary.tsx`
- Change the "Export to PDF" button to navigate to `/handoff-package`, where the user can then click "Download PDF"
- Alternatively, add a small toast saying "Use Download PDF on the Handoff Package page"

## Technical Details

### Print CSS additions to `src/index.css`
```css
@media print {
  @page { margin: 0.5in; }

  body { background: white !important; }

  /* Hide all app chrome */
  .no-print,
  [data-print-hide] {
    display: none !important;
  }

  /* Clean up document container */
  .print-document {
    max-width: 100% !important;
    margin: 0 !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
```

### Markup changes in `HandoffPackage.tsx`
- Add `data-print-hide` attribute to the sticky action bar
- Add `data-print-hide` to the outer background wrapper's non-document elements
- Add `className="print-document"` to the white document container
- Add `onClick={() => window.print()}` to the Download PDF button

### Markup changes in `ReviewSummary.tsx`
- Update the "Export to PDF" button to navigate to `/handoff-package`

## How It Works for the User
1. Advisor clicks "Download PDF" on the Handoff Package page
2. Browser opens print dialog (no internet required)
3. User selects "Save as PDF" as destination
4. PDF file is saved locally to their device

Zero dependencies. Zero network calls. Works fully offline.
