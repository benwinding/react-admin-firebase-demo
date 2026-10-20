import { useSyncExternalStore } from "react";

// Resources stored under the current scenario; scenarios and categories are shared.
export const scenarioResources = [
  "locations",
  "actions",
  "nodes",
  "beacons",
  "images",
  "sounds",
  "mapStyles",
  "broadcasts",
  "variables",
  "people",
];

// Each tab keeps its own current scenario in memory, so switching scenario in
// one tab never redirects another tab's reads and writes. localStorage only
// remembers the last choice for the next page load.
let current = {
  id: localStorage.getItem("scenario"),
  name: localStorage.getItem("scenarioName"),
};
const listeners = new Set();

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function update(id, name) {
  current = { id, name };
  listeners.forEach((listener) => listener());
}

export function getCurrentScenario() {
  return current.id;
}

export function getCurrentScenarioName() {
  return current.name;
}

export function setCurrentScenario(id, name) {
  localStorage.setItem("scenario", id);
  localStorage.setItem("scenarioName", name);
  update(id, name);
}

export function clearCurrentScenario() {
  localStorage.removeItem("scenario");
  localStorage.removeItem("scenarioName");
  update(null, null);
}

export function useCurrentScenario() {
  return useSyncExternalStore(subscribe, getCurrentScenario);
}
