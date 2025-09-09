/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get all immediate card columns
  const cardCols = element.querySelectorAll(':scope > div');
  const rows = [];

  // Header row as per block spec
  const headerRow = ['Cards (cardsNoImages14)'];
  rows.push(headerRow);

  // For each card column, extract the card content
  cardCols.forEach((col) => {
    // Defensive: find the <a> inside the column
    const link = col.querySelector('a');
    if (!link) return;
    // Find the content container inside the link
    const contentDiv = link.querySelector('div');
    if (!contentDiv) return;

    // Remove the icon if present (not needed in card content)
    const icon = contentDiv.querySelector('i');
    if (icon) icon.remove();

    // The rest of contentDiv is the card content: h3, p, etc.
    // We'll use the contentDiv directly as the cell content.
    // This preserves heading, paragraph, and any other structure.
    rows.push([contentDiv]);
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(table);
}
