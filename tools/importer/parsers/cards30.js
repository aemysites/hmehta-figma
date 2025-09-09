/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract card info from a card anchor element
  function extractCardInfo(cardAnchor) {
    // Find the image (mandatory)
    const img = cardAnchor.querySelector('img');
    // Find the card body (contains title, description, arrow)
    const cardBody = cardAnchor.querySelector('.card-body');
    let title = null;
    let desc = null;
    let cta = null;
    if (cardBody) {
      title = cardBody.querySelector('h4, .card-title');
      desc = cardBody.querySelector('p');
      // The CTA is the arrow, but we want to use the cardAnchor's href as the link
      // We'll use the title as the link text if available, otherwise fallback
      if (cardAnchor.href) {
        const link = document.createElement('a');
        link.href = cardAnchor.href;
        link.textContent = (title && title.textContent) ? title.textContent : 'Learn more';
        cta = link;
      }
    }
    // Build the image cell (img element)
    const imageCell = img;
    // Build the text cell (title, desc, cta)
    const textCellContent = [];
    if (title) {
      textCellContent.push(title);
    }
    if (desc) {
      textCellContent.push(desc);
    }
    if (cta) {
      textCellContent.push(document.createElement('br'));
      textCellContent.push(cta);
    }
    return [imageCell, textCellContent];
  }

  // Find all card anchor elements (one per card)
  // Defensive: cards are .gel-featured-teaser-link inside .row > .col-*
  const cardAnchors = element.querySelectorAll('.row > div > a.gel-featured-teaser-link');

  // Build the table rows
  const rows = [];
  // Header row
  rows.push(['Cards (cards30)']);
  // Card rows
  cardAnchors.forEach((cardAnchor) => {
    rows.push(extractCardInfo(cardAnchor));
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(table);
}
