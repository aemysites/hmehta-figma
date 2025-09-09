/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as specified
  const headerRow = ['Cards (cardsNoImages37)'];

  // Get all direct card columns (each is a card)
  const cardCols = element.querySelectorAll(':scope > div');

  // Prepare card rows
  const rows = [];

  cardCols.forEach((col) => {
    // Each col contains an <a> with content
    const link = col.querySelector('a');
    if (!link) return; // Defensive: skip if no link

    // Find the content container inside the link
    const content = link.querySelector('div[data-pseudo-link]');
    if (!content) return;

    // Extract heading and description
    const heading = content.querySelector('h3');
    const description = content.querySelector('p');

    // Compose card cell: heading, description, and link as CTA
    // For this block, the CTA is the link itself, but visually it's not shown as a button, so we add it at the end
    const cellContent = [];
    if (heading) cellContent.push(heading);
    if (description) cellContent.push(description);
    // Add CTA link at the bottom (text from heading, href from link)
    // Only add if link has an href and heading
    if (link.href && heading) {
      const cta = document.createElement('a');
      cta.href = link.href;
      cta.textContent = heading.textContent;
      cellContent.push(cta);
    }

    rows.push([cellContent]);
  });

  // Compose table data
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(block);
}
