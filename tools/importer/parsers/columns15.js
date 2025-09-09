/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by selector
  function getImmediate(selector) {
    return Array.from(element.querySelectorAll(`:scope > ${selector}`));
  }

  // Find the main content column (left)
  let mainCol;
  let sideCol;
  // Find the two main columns by bootstrap grid classes
  const rows = element.querySelectorAll('.row');
  if (rows.length) {
    const cols = rows[0].querySelectorAll(':scope > div');
    if (cols.length >= 2) {
      mainCol = cols[0];
      sideCol = cols[1];
    }
  }

  // Defensive fallback if not found
  if (!mainCol) mainCol = element;

  // --- LEFT COLUMN CONTENT ---
  // Get the main content blocks in order
  const mainBlocks = [];
  // Title
  const title = mainCol.querySelector('h1');
  if (title) mainBlocks.push(title);
  // Lead paragraph
  const lead = mainCol.querySelector('.gel-lead');
  if (lead) mainBlocks.push(lead);
  // Article date
  const articledate = mainCol.querySelector('.gel-article-date');
  if (articledate) mainBlocks.push(articledate);
  // Image with caption
  const imgCaption = mainCol.querySelector('.gel-image-with-caption');
  if (imgCaption) mainBlocks.push(imgCaption);
  // Main text
  const textBlock = mainCol.querySelector('.cmp-text');
  if (textBlock) mainBlocks.push(textBlock);
  // Call to action button
  const cta = mainCol.querySelector('.gel-button');
  if (cta) mainBlocks.push(cta);
  // Category badge (Announcements)
  const badge = mainCol.querySelector('.badge');
  if (badge) mainBlocks.push(badge);
  // Last updated metadata
  const lastUpdated = mainCol.querySelector('.gel-page-metadata');
  if (lastUpdated) mainBlocks.push(lastUpdated);
  // Share this block
  const shareBlock = mainCol.querySelector('.gel-share-this');
  if (shareBlock) mainBlocks.push(shareBlock);

  // --- RIGHT COLUMN CONTENT ---
  // Newsroom list
  let newsroomBlock = null;
  if (sideCol) {
    newsroomBlock = sideCol.querySelector('.gel-news-list');
  }

  // --- TABLE STRUCTURE ---
  const headerRow = ['Columns (columns15)'];
  const contentRow = [
    [ ...mainBlocks ],
    newsroomBlock ? newsroomBlock : document.createElement('div')
  ];

  // Create the block table
  const cells = [
    headerRow,
    contentRow
  ];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
