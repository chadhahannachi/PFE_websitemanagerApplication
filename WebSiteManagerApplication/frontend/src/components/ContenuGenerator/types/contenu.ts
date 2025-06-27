export interface Contenu {
  _id?: string;
  titre: string;
  description: string;
  html_component?: string;
  css_style?: string;
  datePublication?: string;
  isPublished?: boolean;
  entreprise?: string;
  __v?: number;
  styles?: ContenuStyles;
}

export interface ContenuSpecifique {
  _id: string;
  titre: string;
  description: string;
  html_component: string;
  css_style: string;
  isPublished: boolean;
  datePublication: Date;
  entreprise: string;
}

export interface ContenuStyles {
  container?: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    maxWidth?: string;
    margin?: string;
    borderRadius?: string;
    boxShadow?: string;
  };
  items?: {
    backgroundColor?: string;
    color?: string;
    padding?: string;
    borderRadius?: string;
    boxShadow?: string;
    transition?: string;
    hover?: {
      transform?: string;
      boxShadow?: string;
    };
  };
  title?: {
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    marginBottom?: string;
  };
  description?: {
    color?: string;
    fontSize?: string;
    lineHeight?: string;
  };
} 