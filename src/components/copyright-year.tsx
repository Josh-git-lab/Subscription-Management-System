"use client";

import { useEffect, useState } from "react";

const fallbackYear = 2026;

export function CopyrightYear() {
  const [year, setYear] = useState(fallbackYear);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return <>{year}</>;
}
