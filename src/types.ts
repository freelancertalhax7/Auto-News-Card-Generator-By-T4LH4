export interface NewsCard {
  id?: string;
  userId: string;
  title: string;
  excerpt: string;
  source: string;
  date: string;
  imageUrl: string;
  themeId: string;
  isPublic: boolean;
  customization: CardCustomization;
  createdAt: any;
}

export interface CardCustomization {
  titleFont: string;
  titleColor: string;
  excerptColor: string;
  backgroundColor: string;
  accentColor: string;
  overlayOpacity: number;
  fontSize: number;
  textAlign: "left" | "center" | "right";
}
