/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get direct children by selector
  function getDirectChild(parent, selector) {
    return Array.from(parent.children).find(child => child.matches(selector));
  }

  // Find the main row containing columns
  const main = element.querySelector('main.container');
  if (!main) return;
  const row = getDirectChild(main, '.row');
  if (!row) return;

  // Find left and right columns
  const leftCol = getDirectChild(row, '.col-md-4');
  const rightCol = getDirectChild(row, '.col-md-8');
  if (!leftCol || !rightCol) return;

  // --- LEFT COLUMN: Side navigation ---
  // Find side navigation block
  let sideNavBlock = getDirectChild(leftCol, '.aem-Grid');
  if (!sideNavBlock) return;
  let sideNavCol = getDirectChild(sideNavBlock, '.side-nav');
  let sideNavAside = sideNavCol && sideNavCol.querySelector('aside.gel-lhs');
  // Defensive: fallback to the whole leftCol if not found
  const leftContent = sideNavAside || leftCol;

  // --- RIGHT COLUMN: Main content ---
  // Find main grid inside right column
  let rightGrid = getDirectChild(rightCol, '.aem-Grid');
  if (!rightGrid) return;

  // Collect content blocks in right column
  // 1. Title
  const titleBlock = getDirectChild(rightGrid, '.page-title');
  // 2. Main content (usually responsivegrid)
  const contentBlock = getDirectChild(rightGrid, '.responsivegrid');
  // 3. Tags
  const tagsBlock = getDirectChild(rightGrid, '.tags-display');
  // 4. Ownership details (optional)
  const ownershipBlock = getDirectChild(rightGrid, '.page-ownership-details');
  // 5. Date metadata
  const dateBlock = getDirectChild(rightGrid, '.datemetadata');

  // Compose right column content
  const rightContent = document.createElement('div');
  if (titleBlock) rightContent.appendChild(titleBlock);
  if (contentBlock) rightContent.appendChild(contentBlock);
  if (tagsBlock) rightContent.appendChild(tagsBlock);
  if (ownershipBlock && ownershipBlock.childNodes.length > 0) rightContent.appendChild(ownershipBlock);
  if (dateBlock) rightContent.appendChild(dateBlock);

  // --- TABLE BLOCK ---
  const headerRow = ['Columns (columns1)'];
  const contentRow = [leftContent, rightContent];
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
