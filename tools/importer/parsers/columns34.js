/* global WebImporter */
export default function parse(element, { document }) {
  // Find the fullbleedbanner block
  const banner = element.querySelector('.fullbleedbanner, aside.gel-banner-container');
  if (!banner) return;

  // Find the main banner container
  const aside = banner.querySelector('aside.gel-banner-container') || banner;
  const bannerContent = aside.querySelector('.gel-banner__content');

  // --- Column 1: Text content ---
  // We'll collect the title, description, and links
  const contentContainer = bannerContent?.querySelector('.banner__content-container');
  if (!contentContainer) return;

  // Title
  const title = contentContainer.querySelector('.gel-banner__content__title');
  // Description
  const desc = contentContainer.querySelector('p');
  // List context ("Popular")
  const listContext = contentContainer.querySelector('.banner__content-container__list-context');
  // List items (links)
  const listItems = Array.from(contentContainer.querySelectorAll('.banner__content-container__list-item'));

  // Compose column 1
  const col1 = document.createElement('div');
  if (title) col1.appendChild(title);
  if (desc) col1.appendChild(desc);
  if (listContext) col1.appendChild(listContext);
  listItems.forEach(item => col1.appendChild(item));

  // --- Column 2: Image ---
  // Use the desktop image (img-web-rendition)
  const img = aside.querySelector('.img-web-rendition');
  let col2 = null;
  if (img) {
    col2 = img;
  }

  // Build the table rows
  const headerRow = ['Columns (columns34)'];
  const contentRow = [col1, col2].filter(Boolean); // Only include columns that exist

  const cells = [headerRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
