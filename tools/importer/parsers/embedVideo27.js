/* global WebImporter */
export default function parse(element, { document }) {
  // Find the video embed block
  const embedBlock = element.querySelector('div.embed');
  if (!embedBlock) return;

  // Find the iframe inside the embed block
  const iframe = embedBlock.querySelector('iframe');
  if (!iframe || !iframe.src) return;

  // Compose the video link element
  const videoUrl = iframe.src;
  const link = document.createElement('a');
  link.href = videoUrl;
  link.textContent = videoUrl;

  // Find the image poster if present (not in this HTML, but allow for future)
  let image = embedBlock.querySelector('img'); // Not present in this case

  // Compose cell content: image (if present) above the link, then caption if present
  const cellContent = [];
  if (image) {
    cellContent.push(image);
  }
  cellContent.push(link);

  // Optionally add caption below video (if present)
  const caption = embedBlock.querySelector('.gel-script__iframe--caption');
  if (caption) {
    cellContent.push(caption);
  }

  // Table header row
  const headerRow = ['Embed (embedVideo27)'];
  // Table content row
  const contentRow = [cellContent];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original embed block with the new table
  embedBlock.replaceWith(table);
}
