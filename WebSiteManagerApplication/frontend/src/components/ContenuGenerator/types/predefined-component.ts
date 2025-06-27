export interface PredefinedComponent {
  id: string;
  name: string;
  baseHtml: string;
  baseCss: string;
  previewHtml?: string; // Optional: for visual preview with sample content
  previewCss?: string;  // Optional: for visual preview with sample styles
}

const PLACEHOLDER_TITLE = '${title}';
const PLACEHOLDER_DESCRIPTION = '${description}';

export const predefinedComponents: PredefinedComponent[] = [
  {
    id: 'basic-cards',
    name: 'Basic Cards Layout',
    baseHtml: `
      <div class="container">
        <h1>${PLACEHOLDER_TITLE}</h1>
        <p>${PLACEHOLDER_DESCRIPTION}</p>
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
    previewHtml: `
      <div class="container">
        <h1>Our Awesome Services</h1>
        <p>Discover how we can help your business grow with our tailored solutions.</p>
        <div class="card-grid">
          <div class="card">
            <h3>Web Development</h3>
            <p>Building responsive and modern web applications.</p>
          </div>
          <div class="card">
            <h3>Mobile Apps</h3>
            <p>Creating intuitive and powerful mobile experiences for iOS and Android.</p>
          </div>
          <div class="card">
            <h3>Cloud Solutions</h3>
            <p>Scalable and secure cloud infrastructure for your business needs.</p>
          </div>
        </div>
      </div>
    `,
    previewCss: `
      .container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
        font-family: sans-serif;
      }
      h1 {
        text-align: center;
        color: #333;
        margin-bottom: 1.5rem;
      }
      p {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
      }
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 1.5rem;
      }
      .card {
        background-color: #f8f8f8;
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
        font-size: 1.4rem;
        margin-bottom: 0.5rem;
      }
      .card p {
        color: #4b5563;
        font-size: 0.95rem;
        line-height: 1.5;
      }
    `,
  },
  {
    id: 'feature-list',
    name: 'Feature List',
    baseHtml: `
      <div class="container">
        <h2>${PLACEHOLDER_TITLE}</h2>
        <p>${PLACEHOLDER_DESCRIPTION}</p>
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
    previewHtml: `
      <div class="container">
        <h2>Key Features of Our Platform</h2>
        <p>Explore the powerful functionalities designed to streamline your workflow.</p>
        <ul class="feature-list">
          <li class="feature-item">
            <span class="icon">&#9733;</span>
            <div>
              <h3>Easy Integration</h3>
              <p>Seamlessly connect with your existing tools and services.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="icon">&#9733;</span>
            <div>
              <h3>Real-time Analytics</h3>
              <p>Gain actionable insights with up-to-the-minute data.</p>
            </div>
          </li>
          <li class="feature-item">
            <span class="icon">&#9733;</span>
            <div>
              <h3>24/7 Support</h3>
              <p>Our dedicated team is always here to help you succeed.</p>
            </div>
          </li>
        </ul>
      </div>
    `,
    previewCss: `
      .container {
        padding: 2rem;
        max-width: 900px;
        margin: 0 auto;
        font-family: sans-serif;
      }
      h2 {
        text-align: center;
        color: #333;
        margin-bottom: 1.5rem;
      }
      p {
        text-align: center;
        color: #666;
        margin-bottom: 2rem;
      }
      .feature-list {
        list-style: none;
        padding: 0;
      }
      .feature-item {
        background-color: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
        margin-bottom: 1rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
        box-shadow: 0 1px 3px rgba(0,0,0,0.08);
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
        flex-shrink: 0;
      }
    `,
  },
  {
    id: 'pricing-table',
    name: 'Pricing Table',
    baseHtml: `
      <div class="pricing-table">
        <h2>${PLACEHOLDER_TITLE}</h2>
        <p>${PLACEHOLDER_DESCRIPTION}</p>
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
    `,
    previewHtml: `
      <div class="pricing-table">
        <h2>Nos Tarifs</h2>
        <p>Choisissez la formule qui vous convient.</p>
        <div class="plans">
          <div class="plan">
            <div class="price">19€</div>
            <ul>
              <li>1 utilisateur</li>
              <li>Support email</li>
              <li>Accès basique</li>
            </ul>
          </div>
          <div class="plan">
            <div class="price">49€</div>
            <ul>
              <li>5 utilisateurs</li>
              <li>Support prioritaire</li>
              <li>Accès premium</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    previewCss: `
      .pricing-table { padding: 2rem; background: #fff; font-family: sans-serif; }
      .plans { display: flex; gap: 2rem; justify-content: center; }
      .plan { border: 1px solid #e0e0e0; border-radius: 8px; padding: 1.5rem; min-width: 200px; background: #f8f8f8; }
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
        <h2>${PLACEHOLDER_TITLE}</h2>
        <p>${PLACEHOLDER_DESCRIPTION}</p>
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
    `,
    previewHtml: `
      <div class="testimonial-carousel">
        <h2>Ce que disent nos clients</h2>
        <p>Des retours authentiques sur notre service.</p>
        <div class="carousel">
          <div class="testimonial">
            <img class="avatar" src="https://randomuser.me/api/portraits/women/44.jpg" alt="Alice" />
            <p>"Service exceptionnel, équipe à l'écoute !"</p>
            <div class="author">Alice</div>
          </div>
          <div class="testimonial">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/32.jpg" alt="Bob" />
            <p>"Livraison rapide et qualité au rendez-vous."</p>
            <div class="author">Bob</div>
          </div>
          <div class="testimonial">
            <img class="avatar" src="https://randomuser.me/api/portraits/men/85.jpg" alt="Carlos" />
            <p>"Un accompagnement sur-mesure, je recommande !"</p>
            <div class="author">Carlos</div>
          </div>
        </div>
      </div>
    `,
    previewCss: `
      .testimonial-carousel { padding: 2rem; background: #f9fafb; border-radius: 10px; font-family: sans-serif; }
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
        <h2>${PLACEHOLDER_TITLE}</h2>
        <p>${PLACEHOLDER_DESCRIPTION}</p>
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
    `,
    previewHtml: `
      <div class="faq-section">
        <h2>Questions fréquentes</h2>
        <p>Trouvez rapidement les réponses à vos questions.</p>
        <div class="accordion">
          <div class="faq-item">
            <div class="faq-question"><span class="icon-q">&#10068;</span>Comment puis-je m'inscrire ?</div>
            <div class="faq-answer"><span class="icon-a">&#10003;</span>Cliquez sur "S'inscrire" en haut à droite et suivez les instructions.</div>
          </div>
          <div class="faq-item">
            <div class="faq-question"><span class="icon-q">&#10068;</span>Quels moyens de paiement acceptez-vous ?</div>
            <div class="faq-answer"><span class="icon-a">&#10003;</span>Nous acceptons les cartes bancaires et PayPal.</div>
          </div>
          <div class="faq-item">
            <div class="faq-question"><span class="icon-q">&#10068;</span>Puis-je annuler à tout moment ?</div>
            <div class="faq-answer"><span class="icon-a">&#10003;</span>Oui, l'abonnement est sans engagement.</div>
          </div>
        </div>
      </div>
    `,
    previewCss: `
      .faq-section { padding: 2rem; font-family: sans-serif; }
      .accordion { border-top: 1px solid #e0e0e0; }
      .faq-item { border-bottom: 1px solid #e0e0e0; padding: 1rem 0; }
      .faq-question { font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }
      .faq-answer { margin-top: 0.5rem; color: #555; display: flex; align-items: center; gap: 0.5rem; }
      .icon-q { color: #2563eb; font-size: 1.2rem; }
      .icon-a { color: #38a169; font-size: 1.2rem; }
    `
  },
  // Add more predefined components here if needed, matching backend
]; 