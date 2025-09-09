/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: find the main banner content and image columns
  let imageCol, contentCol;
  // Find the .gel-banner fifty_fifty_warpper row
  const bannerRow = element.querySelector('.gel-banner.fifty_fifty_warpper.row');
  if (bannerRow) {
    const cols = bannerRow.querySelectorAll(':scope > div');
    // There should be two columns: one with image, one with content
    if (cols.length === 2) {
      // Identify which is image and which is content
      if (cols[0].querySelector('.media-container')) {
        imageCol = cols[0];
        contentCol = cols[1];
      } else {
        imageCol = cols[1];
        contentCol = cols[0];
      }
    }
  }

  // Defensive fallback: if not found, try to find by class
  if (!imageCol || !contentCol) {
    imageCol = element.querySelector('.media-container.image_container')?.parentElement;
    contentCol = element.querySelector('.gel-banner__content');
  }

  // Prepare the header row
  const headerRow = ['Columns (columns16)'];

  // Prepare the columns row
  const columnsRow = [];

  // First column: content (text + button)
  if (contentCol) {
    // Use the entire contentCol for resilience
    columnsRow.push(contentCol);
  } else {
    // fallback: empty cell
    columnsRow.push('');
  }

  // Second column: image(s)
  if (imageCol) {
    // Use the entire imageCol for resilience
    columnsRow.push(imageCol);
  } else {
    columnsRow.push('');
  }

  // Build the table
  const cells = [headerRow, columnsRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
