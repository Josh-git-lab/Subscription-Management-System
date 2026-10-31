"use client";

import { useSyncExternalStore } from "react";

const fallbackYear = 2026;

function subscribe() {
  return () => {};
}

export function CopyrightYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => fallbackYear,
  );

  return <>{year}</>;
}
