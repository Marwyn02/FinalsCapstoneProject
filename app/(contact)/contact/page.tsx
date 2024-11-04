"use client";

import { ParallaxProvider } from "react-scroll-parallax";

import ContactPage from "@/app/ui/contact/ContactPage";

export default function Page() {
  return (
    <>
      <ParallaxProvider>
        <ContactPage />
      </ParallaxProvider>
    </>
  );
}
