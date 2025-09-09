/* global WebImporter */
export default function parse(element, { document }) {
  // Find the text block
  const textBlock = Array.from(element.querySelectorAll(':scope > div > div'))
    .find(div => div.classList.contains('text'));

  let cardRows = [];
  if (textBlock) {
    const cmpText = textBlock.querySelector('.cmp-text');
    if (cmpText) {
      // Collect all content inside cmp-text (not just heading)
      const content = Array.from(cmpText.childNodes).filter(node => {
        // Keep all element and text nodes (ignore empty text nodes)
        return node.nodeType === 1 || (node.nodeType === 3 && node.textContent.trim());
      });
      if (content.length) {
        // Only output one column (no image variant)
        cardRows.push([content]);
      }
    }
  }

  // Table header must be exactly as specified
  const headerRow = ['Cards (cards10)'];
  const rows = [headerRow, ...cardRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element with the block
  element.replaceWith(block);
}
