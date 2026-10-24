import { create } from 'zustand';
import type { TikTokGiftEvent, TikTokLikeEvent, TikTokChatEvent } from '@/types/tiktok.types';

interface StreamEventsState {
  eventsBuffer: TikTokGiftEvent[];
  lastGift: TikTokGiftEvent | null;
  totalDiamondsSession: number;
  totalLikesSession: number;
  recentChat: TikTokChatEvent[];

  pushGift: (gift: TikTokGiftEvent) => void;
  pushLike: (like: TikTokLikeEvent) => void;
  pushChat: (chat: TikTokChatEvent) => void;
  clearBuffer: () => void;
}

export const useStreamEventsStore = create<StreamEventsState>((set) => ({
  eventsBuffer: [],
  lastGift: null,
  totalDiamondsSession: 0,
  totalLikesSession: 0,
  recentChat: [],

  pushGift: (gift) =>
    set((state) => ({
      lastGift: gift,
      totalDiamondsSession: state.totalDiamondsSession + (gift.diamondCount || 0),
      // Buffer circular limitado estrictamente a 100 items para preservar memoria y CPU a 60 FPS
      eventsBuffer: [gift, ...state.eventsBuffer.slice(0, 99)]
    })),

  pushLike: (like) =>
    set((state) => ({
      totalLikesSession: state.totalLikesSession + (like.likeCount || 1)
    })),

  pushChat: (chat) =>
    set((state) => ({
      recentChat: [chat, ...state.recentChat.slice(0, 49)]
    })),

  clearBuffer: () =>
    set({
      eventsBuffer: [],
      lastGift: null,
      totalDiamondsSession: 0,
      totalLikesSession: 0,
      recentChat: []
    })
}));
