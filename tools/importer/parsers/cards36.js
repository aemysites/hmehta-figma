/* global WebImporter */
export default function parse(element, { document }) {
  // Find all card columns
  const cardCols = Array.from(
    element.querySelectorAll('.wayfinder .wayfinder-component .row > div')
  );

  const headerRow = ['Cards (cards36)'];
  const rows = [headerRow];

  cardCols.forEach((col) => {
    // Anchor containing the card
    const anchor = col.querySelector('a.gel-featured-teaser-link');
    if (!anchor) return;

    // Image
    const img = anchor.querySelector('.wayfinder-component_img-wrapper img');

    // Card body
    const cardBody = anchor.querySelector('.card-body');
    if (!cardBody) return;

    // Title
    const title = cardBody.querySelector('h4.card-title');
    // Description
    const desc = cardBody.querySelector('p');

    // Compose text cell content
    const frag = document.createDocumentFragment();
    if (title) {
      const h = document.createElement('strong');
      h.textContent = title.textContent.trim();
      frag.appendChild(h);
      frag.appendChild(document.createElement('br'));
    }
    if (desc) {
      frag.appendChild(document.createTextNode(desc.textContent.trim()));
      frag.appendChild(document.createElement('br'));
    }
    // Add CTA (arrow) only if present, but use anchor href
    if (anchor.href) {
      frag.appendChild(document.createElement('br'));
      const cta = document.createElement('a');
      cta.href = anchor.href;
      cta.textContent = 'Learn more';
      frag.appendChild(cta);
    }

    rows.push([
      img,
      frag
    ]);
  });

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
