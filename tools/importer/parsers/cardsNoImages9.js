/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Cards (cardsNoImages9)'];
  const rows = [headerRow];

  // Select all immediate card columns
  const cardCols = element.querySelectorAll(':scope > div');

  cardCols.forEach((col) => {
    // Each col contains an <a> with a <div> inside
    const link = col.querySelector('a');
    if (!link) return;
    const cardContent = link.querySelector('div');
    if (!cardContent) return;

    // Defensive: find heading and description
    const heading = cardContent.querySelector('h3');
    const desc = cardContent.querySelector('p');

    // Build the card cell content
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (desc) cellContent.push(desc);
    // No explicit CTA in this HTML, but if needed, could add link
    // For now, just use heading and description

    rows.push([cellContent]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
