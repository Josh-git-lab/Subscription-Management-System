"use client";

import { CloudShader } from "@/components/ui/cloud-shader";

export function HeroSky() {
  return (
    <CloudShader
      className="h-full min-h-0 w-full"
      skyTopColor="#3876ba"
      skyBottomColor="#8cbfe8"
      cloudColor="#fbf8f2"
    />
  );
}
