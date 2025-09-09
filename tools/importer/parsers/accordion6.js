/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate accordion blocks
  const accordions = Array.from(element.querySelectorAll('.showhide-v2'));
  if (!accordions.length) return;

  // Build header row
  const headerRow = ['Accordion (accordion6)'];
  const rows = [headerRow];

  // For each accordion block
  accordions.forEach(acc => {
    // Title: find the clickable label
    let title = '';
    const header = acc.querySelector('.card-header');
    if (header) {
      const titleSpan = header.querySelector('span');
      if (titleSpan) {
        title = titleSpan.textContent.trim();
      } else {
        // fallback: get text from h3 or a
        const h3 = header.querySelector('h3');
        if (h3) {
          title = h3.textContent.trim();
        } else {
          title = header.textContent.trim();
        }
      }
    }
    // Content: find the body
    let content = null;
    const contentDiv = acc.querySelector('.gel-show-hide__content .card-body');
    if (contentDiv) {
      // Use the entire card-body as the content cell
      content = contentDiv;
    } else {
      // fallback: use all children except header
      const children = Array.from(acc.children).filter(child => !child.classList.contains('card-header'));
      if (children.length) {
        content = document.createElement('div');
        children.forEach(child => content.appendChild(child.cloneNode(true)));
      } else {
        content = document.createElement('div');
        content.textContent = '';
      }
    }
    rows.push([title, content]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
