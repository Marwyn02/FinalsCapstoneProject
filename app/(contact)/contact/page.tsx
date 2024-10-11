"use client";

import ContactPage from "@/app/ui/contact/contact-us";
import { ParallaxProvider } from "react-scroll-parallax";

export default function Page() {
  return (
    <>
      <ParallaxProvider>
        <ContactPage />
      </ParallaxProvider>
    </>
  );
}
