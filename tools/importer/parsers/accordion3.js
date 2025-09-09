/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content column
  const mainCol = element.querySelector('.col-md-8');
  if (!mainCol) return;

  // Find the grid containing the text blocks
  const grid = mainCol.querySelector('.aem-Grid');
  if (!grid) return;

  // Find all h2s that are direct children of .text.aem-GridColumn blocks
  const textBlocks = Array.from(grid.querySelectorAll('.text.aem-GridColumn'));

  // Helper: get all h2s in order, with their parent block
  let accordionSections = [];
  textBlocks.forEach(block => {
    Array.from(block.querySelectorAll('h2')).forEach(h2 => {
      accordionSections.push({ h2, block });
    });
  });
  if (!accordionSections.length) return;

  // Helper: get all content between this h2 and the next h2 (across blocks if needed)
  function getSectionContent(startIdx) {
    const { h2, block } = accordionSections[startIdx];
    let contentNodes = [];
    let found = false;
    // Get all nodes after h2 in its block
    let nodes = Array.from(block.childNodes);
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i] === h2) {
        found = true;
        continue;
      }
      if (!found) continue;
      // If another h2, stop
      if (nodes[i].nodeType === 1 && nodes[i].tagName === 'H2') break;
      if (
        (nodes[i].nodeType === 1 && nodes[i].tagName !== 'SCRIPT') ||
        (nodes[i].nodeType === 3 && nodes[i].textContent.trim())
      ) {
        contentNodes.push(nodes[i]);
      }
    }
    // If no content, try to get from next sibling blocks until next h2
    if (!contentNodes.length) {
      let parentGrid = block.parentElement;
      let siblings = Array.from(parentGrid.children);
      let idx = siblings.indexOf(block);
      let nextH2 = null;
      // Find next h2 in any .text.aem-GridColumn after this block
      for (let j = startIdx + 1; j < accordionSections.length; j++) {
        if (accordionSections[j].block !== block) {
          nextH2 = accordionSections[j].h2;
          break;
        }
      }
      for (let k = idx + 1; k < siblings.length; k++) {
        let sib = siblings[k];
        // If we hit a .text.aem-GridColumn with h2, stop
        if (sib.classList.contains('text') && sib.querySelector('h2')) break;
        // If we hit the nextH2, stop
        if (nextH2 && sib.contains(nextH2)) break;
        // Add all children
        Array.from(sib.childNodes).forEach(n => {
          if (
            (n.nodeType === 1 && n.tagName !== 'SCRIPT') ||
            (n.nodeType === 3 && n.textContent.trim())
          ) {
            contentNodes.push(n);
          }
        });
      }
    }
    return contentNodes;
  }

  // Helper: convert iframes to links
  function convertIframesToLinks(nodes) {
    return nodes.map(node => {
      if (node.nodeType === 1 && node.tagName === 'IFRAME' && node.src) {
        const a = document.createElement('a');
        a.href = node.src;
        a.textContent = node.title || node.src;
        a.target = '_blank';
        return a;
      } else if (node.nodeType === 1) {
        Array.from(node.querySelectorAll('iframe')).forEach(iframe => {
          if (iframe.src) {
            const a = document.createElement('a');
            a.href = iframe.src;
            a.textContent = iframe.title || iframe.src;
            a.target = '_blank';
            iframe.replaceWith(a);
          }
        });
        return node;
      }
      return node;
    });
  }

  // Build the accordion table rows
  const rows = [];
  const headerRow = ['Accordion (accordion3)'];
  rows.push(headerRow);

  accordionSections.forEach(({ h2 }, idx) => {
    const titleCell = h2.textContent.trim();
    let contentNodes = getSectionContent(idx);
    // Only add row if there is content
    if (contentNodes.length) {
      let contentCell = convertIframesToLinks(contentNodes);
      rows.push([titleCell, contentCell]);
    }
  });

  // Create the accordion table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
