/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main footer content wrapper
  const footer = element.querySelector('footer');
  if (!footer) return;

  // Get the three main columns
  const combined = footer.querySelector('.gel-section-footer__combined');
  if (!combined) return;
  const container = combined.querySelector('.container');
  if (!container) return;
  const row = container.querySelector('.row.gel-section-footer__row');
  if (!row) return;

  // Get the three column divs
  const col1 = row.querySelector('.gel-section-footer__col1');
  const col2 = row.querySelector('.gel-section-footer__col2');
  const col3 = row.querySelector('.gel-section-footer__col3');

  // Defensive: If any column is missing, fallback to all direct children
  let columns;
  if (col1 && col2 && col3) {
    columns = [col1, col2, col3];
  } else {
    // fallback: get all immediate children of row
    columns = Array.from(row.children);
  }

  // Table header row
  const headerRow = ['Columns (columns25)'];

  // Table content row: each cell is the full column content
  const contentRow = columns.map((col) => col);

  // Build the table
  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
