export interface TikTokGiftItem {
  id?: string;
  name: string;
  name_es?: string;
  coins: number;
  icon_file: string;
  category?: 'popular' | 'classic' | 'exclusive' | 'interactive';
}

export interface GiftFilterOptions {
  query: string;
  minCoins?: number;
  maxCoins?: number;
  category?: string;
}
