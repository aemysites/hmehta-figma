/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the tabs block root
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels (in order)
  const tabLabels = Array.from(
    tabsBlock.querySelectorAll('ul[role="tablist"] > li > a[role="tab"]')
  );

  // Get tab panels (in order)
  const tabPanels = Array.from(
    tabsBlock.querySelectorAll('.gel-tabs__panel-group > div[role="tabpanel"]')
  );

  // Defensive: Ensure labels and panels match
  if (tabLabels.length !== tabPanels.length || tabLabels.length === 0) return;

  // Table header
  const headerRow = ['Tabs (tabs29)'];
  const rows = [headerRow];

  // For each tab, extract label and content
  tabLabels.forEach((labelEl, i) => {
    // Tab label text
    let labelText = labelEl.textContent.trim();
    // Defensive: fallback to aria-label if text missing
    if (!labelText) {
      labelText = labelEl.getAttribute('aria-label') || '';
    }

    // Tab content: get the panel's main content container
    const panel = tabPanels[i];
    // Defensive: get all direct children except invisible/print-only headings
    const contentContainer = panel.querySelector('.gel-content-container') || panel;
    // Remove print-only headings if present
    Array.from(contentContainer.querySelectorAll('.invisible.print-only')).forEach(h => h.remove());

    // Collect all content blocks inside the tab panel
    // Usually one or more .cmp-container, .text, etc.
    let tabContentBlocks = [];
    // If cmp-container exists, use its children
    const cmpContainer = contentContainer.querySelector('.cmp-container');
    if (cmpContainer) {
      tabContentBlocks = Array.from(cmpContainer.children);
    } else {
      // Fallback: use all children of contentContainer
      tabContentBlocks = Array.from(contentContainer.children);
    }
    // Defensive: If no blocks found, use contentContainer itself
    if (tabContentBlocks.length === 0) {
      tabContentBlocks = [contentContainer];
    }

    // Build row: [label, content]
    rows.push([
      labelText,
      tabContentBlocks.length === 1 ? tabContentBlocks[0] : tabContentBlocks
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original tabs block element
  tabsBlock.replaceWith(block);
}
