/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main footer section
  const sectionFooter = element.querySelector('.section-footer footer');
  if (!sectionFooter) return;

  // Find the row containing the three columns
  const row = sectionFooter.querySelector('.gel-section-footer__row');
  if (!row) return;

  // Get the three columns
  const col1 = row.querySelector('.gel-section-footer__col1');
  const col2 = row.querySelector('.gel-section-footer__col2');
  const col3 = row.querySelector('.gel-section-footer__col3');

  // Helper to get ALL content from a column (not just first div)
  function getColContent(col) {
    if (!col) return '';
    // Clone the column node to avoid side effects
    const clone = col.cloneNode(true);
    return Array.from(clone.childNodes);
  }

  // Each cell must include ALL content from the column
  const col1Content = getColContent(col1);
  const col2Content = getColContent(col2);
  const col3Content = getColContent(col3);

  // Compose the columns row: always 3 columns, but some may be empty
  const columnsRow = [col1Content, col2Content, col3Content];

  // Table header
  const headerRow = ['Columns (columns35)'];

  // Create the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow,
  ], document);

  // Replace the original section-footer with the table
  sectionFooter.replaceWith(table);
}
