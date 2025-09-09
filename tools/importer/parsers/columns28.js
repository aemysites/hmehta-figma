/* global WebImporter */
export default function parse(element, { document }) {
  // Find the banner wrapper that contains the two columns
  const banner = element.querySelector('.gel-banner__fullbleed-banner');
  if (!banner) return;
  const columnsRow = banner.querySelector('.gel-banner.fifty_fifty_warpper.row.gel-banner__fullbleed-banner__fifty');
  if (!columnsRow) return;

  // Get the two main column divs
  const colDivs = columnsRow.querySelectorAll(':scope > div');
  if (colDivs.length < 2) return;

  // First column: image(s)
  const imageCol = colDivs[0];
  // Defensive: find the first image in the column
  let imageEl = imageCol.querySelector('img');
  // If there are multiple images, just use the first one (they are likely desktop/mobile renditions)

  // Second column: content
  const contentCol = colDivs[1];
  // Defensive: find the overlay wrapper, then the content
  let contentWrapper = contentCol.querySelector('.gel-banner__content');
  if (!contentWrapper) {
    // fallback: use the column itself
    contentWrapper = contentCol;
  }

  // Build the table rows
  const headerRow = ['Columns (columns28)'];
  const contentRow = [
    imageEl,
    contentWrapper
  ];

  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
