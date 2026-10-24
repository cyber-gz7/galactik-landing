export interface TikTokGiftEvent {
  readonly giftId: string;
  readonly name: string;
  readonly nameEs?: string;
  readonly diamondCount: number;
  readonly repeatCount: number;
  readonly repeatEnd: boolean;
  readonly userId: string;
  readonly uniqueId: string;
  readonly nickname: string;
  readonly avatarUrl?: string;
  readonly timestamp: number;
}

export interface TikTokLikeEvent {
  readonly likeCount: number;
  readonly totalLikes: number;
  readonly userId: string;
  readonly uniqueId: string;
  readonly nickname: string;
}

export interface TikTokChatEvent {
  readonly comment: string;
  readonly userId: string;
  readonly uniqueId: string;
  readonly nickname: string;
}

export type UnifiedStreamEvent =
  | { type: 'gift'; payload: TikTokGiftEvent }
  | { type: 'like'; payload: TikTokLikeEvent }
  | { type: 'chat'; payload: TikTokChatEvent }
  | { type: 'connected'; payload: { username: string; roomId: string } }
  | { type: 'disconnected'; payload: { reason?: string } };
