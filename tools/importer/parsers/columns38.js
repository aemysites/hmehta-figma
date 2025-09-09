/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: ensure we have a UL with LI children
  if (!element || !element.tagName || element.tagName.toLowerCase() !== 'ul') return;

  // Get all LI items (columns)
  const items = Array.from(element.children).filter(el => el.tagName.toLowerCase() === 'li');
  if (!items.length) return;

  // Header row as per spec
  const headerRow = ['Columns (columns38)'];

  // Each LI is a column cell
  const columnsRow = items.map(li => li);

  // Table cells array
  const cells = [headerRow, columnsRow];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
