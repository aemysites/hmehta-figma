/* global WebImporter */
export default function parse(element, { document }) {
  // Find the tabs block
  const tabsBlock = element.querySelector('.cmp-tabs');
  if (!tabsBlock) return;

  // Get tab labels
  const tabLinks = tabsBlock.querySelectorAll('ul[role="tablist"] > li > a');
  // Get tab panels
  const tabPanels = tabsBlock.querySelectorAll('.gel-tabs__panel-group > [role="tabpanel"]');

  // Defensive: Ensure labels and panels match
  if (tabLinks.length !== tabPanels.length || tabLinks.length === 0) return;

  // Table header row
  const headerRow = ['Tabs (tabs33)'];
  const rows = [headerRow];

  // For each tab, add a row: [label, content]
  for (let i = 0; i < tabLinks.length; i++) {
    const label = tabLinks[i].textContent.trim();
    // Find the main content container inside the panel
    let contentContainer = tabPanels[i].querySelector('.tabs-layout-container');
    if (!contentContainer) {
      contentContainer = tabPanels[i];
    }
    // Remove invisible print-only h5 if present
    const printOnlyH5 = contentContainer.querySelector('h5.invisible.print-only');
    if (printOnlyH5) printOnlyH5.remove();
    rows.push([label, contentContainer]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the tabs block with the table
  tabsBlock.replaceWith(block);
}
