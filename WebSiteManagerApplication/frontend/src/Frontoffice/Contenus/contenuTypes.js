// src/constants/contenuTypes.js

export const contenuTypes = {
    Partenaire: {
      label: 'Partenaire',
      specificFields: [
        { name: 'secteurActivite', label: 'Secteur d\'activité', type: 'text' },
      ],
    },
    Temoignage: {
      label: 'Témoignage',
      specificFields: [
        { name: 'auteur', label: 'Auteur', type: 'text' },
      ],
    },
    FAQ: {
      label: 'FAQ',
      specificFields: [
        { name: 'question', label: 'Question', type: 'text' },
        { name: 'reponse', label: 'Réponse', type: 'text' },
      ],
    },
    Evenement: {
      label: 'Événement',
      specificFields: [
        { name: 'dateDebut', label: 'Date de début', type: 'date' },
        { name: 'dateFin', label: 'Date de fin', type: 'date' },
      ],
    },
    Article: {
      label: 'Article',
      specificFields: [
        { name: 'categorie', label: 'Catégorie', type: 'text' },
        { name: 'prix', label: 'Prix', type: 'text' },
      ],
    },
    APropos: {
      label: 'À Propos',
      specificFields: [],
    },
    Actualite: {
      label: 'Actualité',
      specificFields: [],
    },
    Service: {
      label: 'Service',
      specificFields: [],
    },
    Solution: {
      label: 'Solution',
      specificFields: [],
    },
    Unite: {
      label: 'Unité',
      specificFields: [],
    },
  };
  