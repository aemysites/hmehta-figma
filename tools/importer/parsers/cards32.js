/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row as per block spec
  const headerRow = ['Cards (cards32)'];
  const rows = [headerRow];

  // Defensive: Find the row containing all cards
  const row = element.querySelector('.row');
  if (!row) return;

  // Each card is inside a .col-12.col-md-12.col-lg-4.d-flex
  const cardCols = row.querySelectorAll(':scope > div');

  cardCols.forEach((col) => {
    // Find the anchor that wraps the card
    const link = col.querySelector('a.gel-featured-teaser-link');
    if (!link) return;

    // Find the card element
    const card = link.querySelector('.card');
    if (!card) return;

    // --- Image cell ---
    const imgWrapper = card.querySelector('.wayfinder-component_img-wrapper');
    let imgCell = '';
    if (imgWrapper) {
      const img = imgWrapper.querySelector('img');
      if (img) imgCell = img;
    }

    // --- Text cell ---
    const cardBody = card.querySelector('.card-body');
    const textCellContent = [];
    if (cardBody) {
      // Title
      const title = cardBody.querySelector('h4');
      if (title) textCellContent.push(title);
      // Description
      const desc = cardBody.querySelector('p');
      if (desc) textCellContent.push(desc);
      // CTA (arrow icon)
      // Use the link's href as CTA, with arrow icon if present
      const arrow = cardBody.querySelector('.gel-featured-teaser__arrow');
      if (arrow && link.href) {
        // Create a CTA link
        const cta = document.createElement('a');
        cta.href = link.href;
        cta.innerHTML = arrow.innerHTML || 'Read more';
        cta.setAttribute('aria-label', 'Go to ' + (title ? title.textContent : 'details'));
        textCellContent.push(cta);
      }
    }

    rows.push([
      imgCell,
      textCellContent
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
