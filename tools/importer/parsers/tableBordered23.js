/* global WebImporter */
export default function parse(element, { document }) {
  // Find the glossary container
  const glossaryContainer = element.querySelector('#new_content_container_273891');
  if (!glossaryContainer) return;

  // Collect all tables under the glossary container
  const tables = Array.from(glossaryContainer.querySelectorAll('table'));

  // For each table, extract rows as [school type, description]
  const dataRows = [];
  tables.forEach((table) => {
    const rows = Array.from(table.querySelectorAll('tbody > tr'));
    rows.forEach((tr) => {
      const th = tr.querySelector('th');
      const td = tr.querySelector('td');
      // Only add rows with both th and td
      if (th && td) {
        // Use textContent for th and td, but preserve HTML for td if needed
        // To avoid empty columns, push only the text/HTML, not the elements themselves
        dataRows.push([
          th.textContent.trim(),
          td.innerHTML.trim()
        ]);
      }
    });
  });

  // Header row is always the block name
  const headerRow = ['Table (bordered, tableBordered23)'];
  const cells = [headerRow, ...dataRows];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
