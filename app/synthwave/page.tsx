import type { Metadata } from "next";
import { SynthwavePage } from "@/components/pages/synthwave";

export const metadata: Metadata = {
  title: "Synthwave",
  description: "Neon-soaked growth campaigns with ROI that glows in the dark.",
};

export default function Page() {
  return <SynthwavePage />;
}
