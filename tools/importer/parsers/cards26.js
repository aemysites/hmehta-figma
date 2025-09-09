/* global WebImporter */
export default function parse(element, { document }) {
  // Table header row
  const headerRow = ['Cards (cards26)'];
  const rows = [headerRow];

  // Get all immediate card columns
  const cardColumns = element.querySelectorAll(':scope > div');

  cardColumns.forEach((col) => {
    // Each col contains an <a> with the card
    const cardLink = col.querySelector('a.gel-featured-teaser-link');
    if (!cardLink) return;

    // Image: inside .wayfinder-component_img-wrapper > img
    const imgWrapper = cardLink.querySelector('.wayfinder-component_img-wrapper');
    let imgEl = null;
    if (imgWrapper) {
      imgEl = imgWrapper.querySelector('img');
    }

    // Card content: get all content from .card-body.gel-featured-teaser__content_variant
    const cardBody = cardLink.querySelector('.card-body.gel-featured-teaser__content_variant');
    let contentEls = [];
    if (cardBody) {
      // Clone all children of cardBody (to preserve all text and structure)
      Array.from(cardBody.childNodes).forEach((node) => {
        // Skip arrow icon
        if (node.classList && node.classList.contains('gel-featured-teaser__arrow')) return;
        // If it's a text node with only whitespace, skip
        if (node.nodeType === Node.TEXT_NODE && !node.textContent.trim()) return;
        contentEls.push(node.cloneNode(true));
      });
      // Add CTA: link to article (use cardLink.href)
      if (cardLink.href) {
        const ctaLink = document.createElement('a');
        ctaLink.href = cardLink.href;
        ctaLink.textContent = 'Read more';
        ctaLink.setAttribute('target', '_blank');
        contentEls.push(ctaLink);
      }
    }

    // Add row: [image, [all content elements]]
    if (imgEl && contentEls.length) {
      rows.push([imgEl, contentEls]);
    }
  });

  // Create the block table and replace the element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
