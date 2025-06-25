export interface PredefinedComponent {
  id: string;
  name: string;
  baseHtml: string;
  baseCss: string;
}

export const predefinedComponents: PredefinedComponent[] = [
  {
    id: 'basic-cards',
    name: 'Basic Cards Layout',
    baseHtml: `
      <div class="container">
        <h1>\${title}</h1>
        <p>\${description}</p>
        <div class="card-grid">
          <!-- ITEMS_PLACEHOLDER -->
        </div>
      </div>
    `,
    baseCss: `
      .container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }
      .card {
        background-color: #f3f4f6;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        padding: 1.5rem;
        transition: transform 0.2s ease-in-out;
      }
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      }
      .card h3 {
        color: #2563eb;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }
      .card p {
        color: #4b5563;
        font-size: 1rem;
        line-height: 1.5;
      }
    `,
  },
  {
    id: 'feature-list',
    name: 'Feature List',
    baseHtml: `
      <div class="container">
        <h2>\${title}</h2>
        <p>\${description}</p>
        <ul class="feature-list">
          <!-- ITEMS_PLACEHOLDER -->
        </ul>
      </div>
    `,
    baseCss: `
      .container {
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
      }
      .feature-list {
        list-style: none;
        padding: 0;
      }
      .feature-item {
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 5px;
        margin-bottom: 1rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .feature-item h3 {
        color: #1a202c;
        font-size: 1.2rem;
        margin: 0;
      }
      .feature-item p {
        color: #4a5568;
        font-size: 0.9rem;
        margin: 0;
      }
      .icon {
        color: #38a169;
        font-size: 1.5rem;
      }
    `,
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    baseHtml: `
      <div class="pricing-table">
        <h2>${'${title}'}</h2>
        <p>${'${description}'}</p>
        <div class="plans">
          <!-- ITEMS_PLACEHOLDER -->
        </div>
      </div>
    `,
    baseCss: `
      .pricing-table { padding: 2rem; background: #fff; }
      .plans { display: flex; gap: 2rem; justify-content: center; }
      .plan { border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; min-width: 200px; }
      .plan .price { font-size: 2rem; color: #38a169; margin-bottom: 1rem; }
      .plan ul { list-style: none; padding: 0; }
      .plan li { margin-bottom: 0.5rem; }
    `
  },
  {
    id: 'testimonial-carousel',
    name: 'Testimonial Carousel',
    baseHtml: `
      <div class="testimonial-carousel">
        <h2>${'${title}'}</h2>
        <p>${'${description}'}</p>
        <div class="carousel">
          <!-- ITEMS_PLACEHOLDER -->
        </div>
      </div>
    `,
    baseCss: `
      .testimonial-carousel { padding: 2rem; background: #f9fafb; border-radius: 10px; }
      .carousel { display: flex; gap: 2rem; overflow-x: auto; }
      .testimonial { background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #0001; padding: 1.5rem; min-width: 250px; display: flex; flex-direction: column; align-items: center; }
      .testimonial p { font-style: italic; }
      .testimonial .author { margin-top: 1rem; font-weight: bold; color: #2563eb; }
      .testimonial .avatar { width: 48px; height: 48px; border-radius: 50%; margin-bottom: 1rem; object-fit: cover; }
    `
  },
  {
    id: 'faq-accordion',
    name: 'FAQ Accordion',
    baseHtml: `
      <div class="faq-section">
        <h2>${'${title}'}</h2>
        <p>${'${description}'}</p>
        <div class="accordion">
          <!-- ITEMS_PLACEHOLDER -->
        </div>
      </div>
    `,
    baseCss: `
      .faq-section { padding: 2rem; }
      .accordion { border-top: 1px solid #e0e0e0; }
      .faq-item { border-bottom: 1px solid #e0e0e0; padding: 1rem 0; }
      .faq-question { font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
      .faq-answer { margin-top: 0.5rem; color: #555; display: flex; align-items: center; gap: 0.5rem; }
      .icon-q { color: #2563eb; font-size: 1.2rem; }
      .icon-a { color: #38a169; font-size: 1.2rem; }
    `
  },
  // Add more predefined components here
]; 