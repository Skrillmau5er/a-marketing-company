import type { Metadata } from "next";
import { BloomPage } from "@/components/pages/bloom";

export const metadata: Metadata = {
  title: "Bloom",
  description: "Soft, organic brand identities that grow on people.",
};

export default function Page() {
  return <BloomPage />;
}
