/* global WebImporter */
export default function parse(element, { document }) {
  // Find the table containing the relevant tabular data
  const table = element.querySelector('table');
  if (!table) return;

  // Build the block table rows
  const cells = [];

  // 1. Header row with block name
  cells.push(['Table (table7)']);

  // 2. Table header row (from source table)
  const thead = table.querySelector('thead');
  if (thead) {
    const headerCells = Array.from(thead.querySelectorAll('th')).map(th => th.textContent.trim());
    cells.push(headerCells);
  }

  // 3. Table body rows
  const tbody = table.querySelector('tbody');
  if (tbody) {
    Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
      // Each row: collect all td elements (extract text content, preserving line breaks if present)
      const rowCells = Array.from(tr.querySelectorAll('td')).map(td => {
        // If the cell contains a <p>, join their text with line breaks, else use td.textContent
        const ps = td.querySelectorAll('p');
        if (ps.length > 0) {
          return Array.from(ps).map(p => p.textContent.trim()).join('\n');
        }
        return td.textContent.trim();
      });
      cells.push(rowCells);
    });
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original table with the block table
  table.replaceWith(block);
}
