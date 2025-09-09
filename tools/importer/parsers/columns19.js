/* global WebImporter */
export default function parse(element, { document }) {
  // Find the left (content) and right (video) columns
  let contentCol = element.querySelector('.gel-banner__fullbleed-banner__overlay-wrapper .gel-banner__content');
  let videoCol = element.querySelector('.gel-banner__video');

  // Fallbacks if selectors fail
  if (!contentCol || !videoCol) {
    const mainBanner = element.querySelector('.gel-banner__fullbleed-banner');
    if (mainBanner) {
      const divs = mainBanner.querySelectorAll(':scope > div');
      if (divs.length >= 2) {
        if (!contentCol) contentCol = divs[0];
        if (!videoCol) videoCol = divs[1];
      }
    }
  }
  if (!contentCol) contentCol = document.createElement('div');
  if (!videoCol) videoCol = document.createElement('div');

  // --- Fix: Convert iframe to link ---
  // Find any iframe in the video column and replace with a link to its src
  const iframe = videoCol.querySelector('iframe');
  if (iframe && iframe.src) {
    const link = document.createElement('a');
    link.href = iframe.src;
    link.textContent = 'Watch video';
    // Remove the iframe and insert the link
    iframe.replaceWith(link);
  }

  // Table header must match block name exactly
  const headerRow = ['Columns (columns19)'];
  const contentRow = [contentCol, videoCol];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    contentRow
  ], document);

  element.replaceWith(table);
}
