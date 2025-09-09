/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main content area
  const main = element.querySelector('main.container');
  if (!main) return;

  // Find the main content column
  const colMain = main.querySelector('.col-md-8');
  if (!colMain) return;

  // Find all direct children of the main content column
  const colChildren = Array.from(colMain.querySelector('.aem-Grid').children);

  // Find the block with all the accordion sections (the big text block)
  let accordionBlock = null;
  for (const child of colChildren) {
    if (
      child.classList.contains('text') &&
      child.querySelectorAll('h2').length >= 1
    ) {
      accordionBlock = child;
      break;
    }
  }
  if (!accordionBlock) return;

  // Get all h2s (accordion titles)
  const h2s = Array.from(accordionBlock.querySelectorAll('h2'));

  // We'll build rows: [title, content]
  const rows = [];

  // For each h2, collect its content until the next h2
  h2s.forEach((h2, idx) => {
    // Title cell: clone the h2 element
    const titleCell = h2.cloneNode(true);

    // Content cell: collect all siblings until next h2
    const contentNodes = [];
    let node = h2.nextSibling;
    while (node && !(node.nodeType === 1 && node.tagName === 'H2')) {
      if (
        node.nodeType === 1 ||
        (node.nodeType === 3 && node.textContent.trim())
      ) {
        contentNodes.push(node.cloneNode(true));
      }
      node = node.nextSibling;
    }

    // Special handling for the first accordion item: add the intro paragraph and video above
    if (idx === 0) {
      // Find the intro paragraph (the text block above the accordion block)
      let introPara = null;
      for (const child of colChildren) {
        if (
          child.classList.contains('text') &&
          child !== accordionBlock
        ) {
          const para = child.querySelector('p');
          if (para) introPara = para.cloneNode(true);
        }
      }
      if (introPara) {
        contentNodes.unshift(introPara);
      }
      // Find the video iframe (the script block above the accordion block)
      for (const child of colChildren) {
        if (child.classList.contains('script')) {
          const iframe = child.querySelector('iframe');
          if (iframe && iframe.src) {
            const videoLink = document.createElement('a');
            videoLink.href = iframe.src;
            videoLink.textContent = 'Watch video';
            contentNodes.unshift(videoLink);
            break;
          }
        }
      }
    }

    // Add row: [titleCell, contentCell]
    rows.push([
      titleCell,
      contentNodes.length === 1 ? contentNodes[0] : contentNodes
    ]);
  });

  // Table header
  const headerRow = ['Accordion (accordion20)'];
  const cells = [headerRow, ...rows];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
