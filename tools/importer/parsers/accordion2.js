/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column
  const mainCol = element.querySelector('.col-md-8');
  if (!mainCol) return;

  // Find all .text blocks in order
  const textBlocks = Array.from(mainCol.querySelectorAll('.text'));

  // Find all h2s that are section headers (accordion items)
  const sectionHeaders = [];
  textBlocks.forEach((tb, idx) => {
    const h2s = tb.querySelectorAll('.cmp-text > h2');
    h2s.forEach(h2 => {
      sectionHeaders.push({
        idx,
        h2,
        block: tb
      });
    });
  });

  // Helper: get all .text blocks between two indices (exclusive)
  function getTextBlocksBetween(startIdx, endIdx) {
    return textBlocks.slice(startIdx + 1, endIdx);
  }

  // For each section header, collect its content until the next header
  const accordionRows = [];
  for (let i = 0; i < sectionHeaders.length; i++) {
    const { idx, h2, block } = sectionHeaders[i];
    const nextIdx = (i + 1 < sectionHeaders.length) ? sectionHeaders[i + 1].idx : textBlocks.length;
    // Collect all elements after this h2 in this .cmp-text, plus all .text blocks until next header
    const cmpText = block.querySelector('.cmp-text');
    let contentEls = [];
    let foundH2 = false;
    if (cmpText) {
      for (const child of cmpText.children) {
        if (child === h2) {
          foundH2 = true;
          continue;
        }
        if (foundH2) {
          contentEls.push(child);
        }
      }
    }
    // Add all .cmp-text children from subsequent .text blocks until next header
    const betweenBlocks = getTextBlocksBetween(idx, nextIdx);
    betweenBlocks.forEach(tb => {
      const ct = tb.querySelector('.cmp-text');
      if (ct) {
        Array.from(ct.children).forEach(child => {
          contentEls.push(child);
        });
      }
    });
    // Defensive: fallback to cmpText if nothing found
    if (contentEls.length === 0 && cmpText) {
      Array.from(cmpText.children).forEach(child => {
        if (child !== h2) contentEls.push(child);
      });
    }
    // --- FIX: If contentEls is still empty, try to get all siblings after h2 in the parent .text block ---
    if (contentEls.length === 0) {
      let parent = h2.parentElement;
      let found = false;
      let siblings = [];
      for (const child of parent.children) {
        if (child === h2) {
          found = true;
          continue;
        }
        if (found) {
          siblings.push(child);
        }
      }
      if (siblings.length > 0) {
        contentEls = siblings;
      }
    }
    // --- END FIX ---
    // Only add non-empty rows
    if (
      h2.textContent.trim() &&
      contentEls.length > 0 &&
      contentEls.some(el => el.textContent && el.textContent.trim())
    ) {
      accordionRows.push([h2, contentEls]);
    }
  }

  // Compose the final table
  const headerRow = ['Accordion (accordion2)'];
  const tableRows = [headerRow, ...accordionRows];

  // Remove any rows that would be empty (defensive, for edge cases)
  const filteredRows = [tableRows[0]];
  for (let i = 1; i < tableRows.length; i++) {
    const row = tableRows[i];
    const title = row[0];
    const content = row[1];
    if (
      title && title.textContent && title.textContent.trim() &&
      Array.isArray(content) && content.length > 0 && content.some(el => el.textContent && el.textContent.trim())
    ) {
      filteredRows.push(row);
    }
  }

  // --- FIX: If any accordion row's content is still empty, try to get all text content from its .text block ---
  for (let i = 1; i < filteredRows.length; i++) {
    const row = filteredRows[i];
    const title = row[0];
    let content = row[1];
    if (!content || !content.some(el => el.textContent && el.textContent.trim())) {
      // fallback: get all children except h2 from the .cmp-text
      const block = sectionHeaders[i-1].block;
      const cmpText = block.querySelector('.cmp-text');
      if (cmpText) {
        content = Array.from(cmpText.children).filter(child => child !== title);
        filteredRows[i][1] = content;
      }
    }
  }
  // --- END FIX ---

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(filteredRows, document);

  // Replace the original element
  element.replaceWith(block);
}
