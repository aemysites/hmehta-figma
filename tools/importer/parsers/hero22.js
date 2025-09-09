/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the main figure containing the image and caption
  const figure = element.querySelector('figure');
  if (!figure) return;

  // Find the main image for desktop (prefer web rendition)
  const img = figure.querySelector('img.img-web-rendition') || figure.querySelector('img');

  // Defensive: If no image, skip block creation
  if (!img) return;

  // Find the figcaption (caption text)
  const figcaption = figure.querySelector('figcaption');

  // Table header row
  const headerRow = ['Hero (hero22)'];

  // Second row: image only
  const imageRow = [img];

  // Third row: caption (if present)
  let captionRow;
  if (figcaption) {
    captionRow = [figcaption];
  } else {
    captionRow = [''];
  }

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    captionRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
