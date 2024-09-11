export interface SteamGames {
  id: string;
  name: string;
  isActive: boolean;
}

export interface GameNewsModel {
  author: string;
  date: Date;
  gameId: string;
  id: number;
  link: string;
  summary: string;
  thumbnailLink?: string;
  title: string;
}
