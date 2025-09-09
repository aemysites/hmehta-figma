/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract accordion items from showhide-v2 blocks
  function getAccordionItems(root) {
    const items = [];
    // Find all .showhide-v2 blocks at any depth
    const showhideBlocks = Array.from(root.querySelectorAll('.showhide-v2'));
    showhideBlocks.forEach((block) => {
      // Find the card header (title)
      const header = block.querySelector('.card-header .gel-show-hide_title');
      let titleContent = '';
      if (header) {
        // The clickable title is inside the <a> tag's <span>
        const link = header.querySelector('.gel-show-hide_link');
        if (link) {
          const span = link.querySelector('span');
          if (span) {
            titleContent = span.textContent.trim();
          } else {
            titleContent = link.textContent.trim();
          }
        } else {
          titleContent = header.textContent.trim();
        }
      }
      // Find the card body (content)
      const body = block.querySelector('.gel-show-hide__content .card-body');
      let content = '';
      if (body) {
        // Use the entire card-body as content (HTML)
        content = document.createElement('div');
        content.innerHTML = body.innerHTML;
      }
      if (titleContent && content) {
        items.push([titleContent, content]);
      }
    });
    return items;
  }

  // Defensive: find the main content grid
  let grid = element;
  // If the element is a grid wrapper, descend to the main grid
  const mainGrid = grid.querySelector('.aem-Grid.aem-Grid--12.aem-Grid--default--12');
  if (mainGrid) grid = mainGrid;

  // Extract all accordion items
  const accordionItems = getAccordionItems(grid);

  // Only build block if there are accordion items
  if (accordionItems.length) {
    const headerRow = ['Accordion (accordion21)'];
    const cells = [headerRow, ...accordionItems];
    const table = WebImporter.DOMUtils.createTable(cells, document);
    element.replaceWith(table);
  }
}
