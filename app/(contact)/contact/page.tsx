"use client";

import { ParallaxProvider } from "react-scroll-parallax";

import ContactPage from "@/features/contact/components/ContactPage";

export default function Page() {
  return (
    <>
      <ParallaxProvider>
        <ContactPage />
      </ParallaxProvider>
    </>
  );
}
