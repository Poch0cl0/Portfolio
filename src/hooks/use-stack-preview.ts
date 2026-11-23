"use client";

import { useSyncExternalStore } from "react";

export const stackTabIds = ["frontend", "backend", "databases", "aiml", "devops", "testing"] as const;
type StackTab = (typeof stackTabIds)[number];

interface StackPreviewState {
  activeTab: StackTab;
  flippedCards: ReadonlySet<string>;
}

const initialState: StackPreviewState = {
  activeTab: "frontend",
  flippedCards: new Set(),
};

// Keep the controls' state when a client navigation replaces the locale segment.
let state = initialState;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

function getSnapshot() {
  return state;
}

function getServerSnapshot() {
  return initialState;
}

function updateState(next: StackPreviewState) {
  state = next;
  listeners.forEach((listener) => listener());
}

function setActiveTab(activeTab: StackTab) {
  if (activeTab !== state.activeTab) updateState({ ...state, activeTab });
}

function toggleCard(id: string) {
  const flippedCards = new Set(state.flippedCards);
  if (flippedCards.has(id)) {
    flippedCards.delete(id);
  } else {
    flippedCards.add(id);
  }
  updateState({ ...state, flippedCards });
}

export function useStackPreview() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { ...snapshot, setActiveTab, toggleCard };
}
