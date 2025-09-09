/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Accordion (accordion4)'];
  const rows = [];

  // Find the main content grid
  const contentRoot = element.querySelector('.aem-Grid.aem-Grid--12');
  if (!contentRoot) return;

  // Find all .showhide accordions in order
  const accordionBlocks = Array.from(contentRoot.querySelectorAll('.showhide .gel-show-hide'));

  // Titles for each accordion block (in order)
  const sectionTitles = [
    'School administration',
    'Classroom support',
    'Other supporting roles'
  ];

  accordionBlocks.forEach((accordion, idx) => {
    // For each card in the accordion
    const cards = Array.from(accordion.querySelectorAll('.card'));
    cards.forEach(card => {
      // Title: from button text
      const btn = card.querySelector('button.gel-show-hide_link');
      let title = btn ? btn.textContent.replace(/^[\s\n]+|[\s\n]+$/g, '') : '';
      // Content: from .card-body
      const body = card.querySelector('.card-body');
      let content = [];
      if (body) {
        // Clone all children of card-body
        content = Array.from(body.childNodes).map(node => node.cloneNode(true));
      }
      // Push row
      rows.push([title, content]);
    });
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
