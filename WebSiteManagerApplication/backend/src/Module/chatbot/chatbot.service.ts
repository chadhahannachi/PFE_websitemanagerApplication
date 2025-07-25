import { Injectable } from '@nestjs/common';
import { EntrepriseService } from '../entreprise/entreprise.service';
import { ContenuService } from '../contenus/contenus.service';
import { PreferenceService } from '../preferences/preferences.service';
import { CouleurService } from '../couleurs/couleurs.service';
import { PageService } from '../Pages/pages.service';
import { MenuService } from '../menus/menus.service';
import { NavbarService } from '../navbars/navbars.service';
import { CookieService } from '../cookies/cookies.service';
import { FormulaireService } from '../forms/forms.service';
import { SlideService } from '../Slides/slides.service';
import { GeminiService } from '../contenus/services/gemini.service';

@Injectable()
export class ChatbotService {
  constructor(
    private readonly entrepriseService: EntrepriseService,
    private readonly contenuService: ContenuService,
    private readonly preferencesService: PreferenceService,
    private readonly couleursService: CouleurService,
    private readonly pageService: PageService,
    private readonly menuService: MenuService,
    private readonly navbarService: NavbarService,
    private readonly cookieService: CookieService,
    private readonly formulaireService: FormulaireService,
    private readonly slidesService: SlideService,
    private readonly geminiService: GeminiService,
  ) {}

  async aggregateEntrepriseData(entrepriseId: string): Promise<any> {
    // Récupérer toutes les données liées à l'entreprise
    const [
      entreprise,
      partenaires,
      unites,
      services,
      solutions,
      evenements,
      faqs,
      apropos,
      contactus,
      formulaires,
      contenusSpecifiques,
      preferences,
      couleurs,
      pages,
      menus,
      navbars,
      cookies,
      slides
    ] = await Promise.all([
      this.entrepriseService.findOne(entrepriseId),
      this.contenuService.findContenuByEntreprise('Partenaire', entrepriseId),
      this.contenuService.findContenuByEntreprise('Unite', entrepriseId),
      this.contenuService.findContenuByEntreprise('Service', entrepriseId),
      this.contenuService.findContenuByEntreprise('Solution', entrepriseId),
      this.contenuService.findContenuByEntreprise('Evenement', entrepriseId),
      this.contenuService.findContenuByEntreprise('FAQ', entrepriseId),
      this.contenuService.findContenuByEntreprise('APropos', entrepriseId),
      this.contenuService.findContenuByEntreprise('ContactUs', entrepriseId),
      this.formulaireService.findFormulairesByEntreprise(entrepriseId),
      this.contenuService.findContenuByEntreprise('ContenuSpecifique', entrepriseId),
      this.preferencesService.findPreferenceByEntreprise(entrepriseId),
      this.couleursService.findCouleurByEntreprise(entrepriseId),
      this.pageService.findPagesByEntreprise(entrepriseId),
      this.menuService.findMenusByEntreprise(entrepriseId),
      this.navbarService.findNavbarsByEntreprise(entrepriseId),
      this.cookieService.findCookiesByEntreprise(entrepriseId),
      this.slidesService.findSlideByEntreprise(entrepriseId),
    ]);
    return {
      entreprise,
      partenaires,
      unites,
      services,
      solutions,
      evenements,
      faqs,
      apropos,
      contactus,
      formulaires,
      contenusSpecifiques,
      preferences,
      couleurs,
      pages,
      menus,
      navbars,
      cookies,
      slides
    };
  }

  async extractEntrepriseTypography(entrepriseId: string): Promise<string | null> {
    // Récupère les préférences de l'entreprise
    const prefDoc = await this.preferencesService.findPreferenceByEntreprise(entrepriseId);
    if (!prefDoc || !prefDoc.preferences) return null;
    const preferences = prefDoc.preferences;
    // On cherche la police dans navbar.styles ou slider.styles, sinon null
    let font = null;
    if (preferences.navbar && preferences.navbar.styles && preferences.navbar.styles.navLinkFont) {
      font = preferences.navbar.styles.navLinkFont;
    } else if (preferences.slider && preferences.slider.styles && preferences.slider.styles.titleFont) {
      font = preferences.slider.styles.titleFont;
    }
    return font;
  }

  async extractAllEntrepriseTypographies(entrepriseId: string): Promise<{ [key: string]: string }> {
    const prefDoc = await this.preferencesService.findPreferenceByEntreprise(entrepriseId);
    if (!prefDoc || !prefDoc.preferences) return {};
    const preferences = prefDoc.preferences;
    const fonts: { [key: string]: string } = {};
    // Navbar
    if (preferences.navbar?.styles?.navLinkFont) {
      fonts['Navbar'] = preferences.navbar.styles.navLinkFont;
    }
    // Slider
    if (preferences.slider?.styles?.titleFont) {
      fonts['Slider Title'] = preferences.slider.styles.titleFont;
    }
    if (preferences.slider?.styles?.descFont) {
      fonts['Slider Description'] = preferences.slider.styles.descFont;
    }
    // About
    if (preferences.about?.styles?.titleFont) {
      fonts['About Title'] = preferences.about.styles.titleFont;
    }
    if (preferences.about?.styles?.descFont) {
      fonts['About Description'] = preferences.about.styles.descFont;
    }
    // Units
    if (preferences.units?.styles?.titleFont) {
      fonts['Units Title'] = preferences.units.styles.titleFont;
    }
    if (preferences.units?.styles?.descFont) {
      fonts['Units Description'] = preferences.units.styles.descFont;
    }
    // Services
    if (preferences.services?.styles?.titleFont) {
      fonts['Services Title'] = preferences.services.styles.titleFont;
    }
    if (preferences.services?.styles?.descFont) {
      fonts['Services Description'] = preferences.services.styles.descFont;
    }
    // Solutions
    if (preferences.solutions?.styles?.titleFont) {
      fonts['Solutions Title'] = preferences.solutions.styles.titleFont;
    }
    if (preferences.solutions?.styles?.descFont) {
      fonts['Solutions Description'] = preferences.solutions.styles.descFont;
    }
    // Events
    if (preferences.events?.styles?.titleFont) {
      fonts['Events Title'] = preferences.events.styles.titleFont;
    }
    if (preferences.events?.styles?.descFont) {
      fonts['Events Description'] = preferences.events.styles.descFont;
    }
    // FAQ
    if (preferences.faq?.styles?.titleFont) {
      fonts['FAQ Title'] = preferences.faq.styles.titleFont;
    }
    if (preferences.faq?.styles?.descFont) {
      fonts['FAQ Description'] = preferences.faq.styles.descFont;
    }
    // Contact
    if (preferences.contact?.styles?.titleFont) {
      fonts['Contact Title'] = preferences.contact.styles.titleFont;
    }
    if (preferences.contact?.styles?.descFont) {
      fonts['Contact Description'] = preferences.contact.styles.descFont;
    }
    // Partners
    if (preferences.partners?.styles?.titleFont) {
      fonts['Partners Title'] = preferences.partners.styles.titleFont;
    }
    if (preferences.partners?.styles?.descFont) {
      fonts['Partners Description'] = preferences.partners.styles.descFont;
    }
    // Pages
    if (preferences.pages?.styles?.titleFont) {
      fonts['Pages Title'] = preferences.pages.styles.titleFont;
    }
    if (preferences.pages?.styles?.descFont) {
      fonts['Pages Description'] = preferences.pages.styles.descFont;
    }
    // Menus
    if (preferences.menus?.styles?.titleFont) {
      fonts['Menus Title'] = preferences.menus.styles.titleFont;
    }
    if (preferences.menus?.styles?.descFont) {
      fonts['Menus Description'] = preferences.menus.styles.descFont;
    }
    // Ajoute d'autres sections si besoin
    return fonts;
  }

  buildPrompt(data: any, question: string): string {
    // Construit un prompt contextuel à partir des données agrégées
    return `Voici toutes les informations sur l'entreprise :\n${JSON.stringify(data, null, 2)}\n\nQuestion de l'utilisateur : ${question}\nRéponds de façon précise et concise.`;
  }

  async askEntrepriseChatbot(entrepriseId: string, question: string): Promise<string> {
    const data = await this.aggregateEntrepriseData(entrepriseId);
    const prompt = this.buildPrompt(data, question);
    const response = await this.geminiService.generateTextResponse(prompt);
    return response;
  }

  async askEntrepriseFontsAI(entrepriseId: string): Promise<string> {
    const prefDoc = await this.preferencesService.findPreferenceByEntreprise(entrepriseId);
    const preferences = prefDoc?.preferences || {};

    // Récupère tous les contenus de l'entreprise (tous types confondus)
    const contenus = await this.contenuService.getContenusByEntreprise(entrepriseId);
    // On extrait pour chaque contenu son titre, type, et styles
    const contenusStyles = (contenus || []).map((c: any) => ({
      id: c._id,
      titre: c.titre,
      type: c.type || c.constructor?.name || 'Contenu',
      styles: c.styles || {},
    }));

    const prompt = `
Voici l'objet complet des préférences de l'entreprise :
${JSON.stringify(preferences, null, 2)}

Voici la liste de tous les contenus de l'entreprise, avec leurs styles :
${JSON.stringify(contenusStyles, null, 2)}

Ta tâche :
- Parcours récursivement toutes les propriétés de ces objets (préférences ET styles de chaque contenu).
- Pour chaque propriété qui correspond à une police (ex: font, fontFamily, navLinkFont, titleFont, descFont, etc.), extrait la valeur.
- Retourne uniquement la liste unique des polices utilisées par l'entreprise, sans usages, sans explication, sans regroupement, sans détails.
- Formate la réponse comme une liste simple, une police par ligne, sans texte supplémentaire.
    `;
    const response = await this.geminiService.generateTextResponse(prompt);
    return response;
  }
} 