import { useSyncExternalStore } from "react";

// The scenario being edited lives in localStorage ("scenario" / "scenarioName").
// This module lets components re-render when it changes.
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getCurrentScenario() {
  return localStorage.getItem("scenario");
}

export function setCurrentScenario(id, name) {
  localStorage.setItem("scenario", id);
  localStorage.setItem("scenarioName", name);
  listeners.forEach((listener) => listener());
}

export function useCurrentScenario() {
  return useSyncExternalStore(subscribe, getCurrentScenario);
}
