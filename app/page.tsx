"use client";

import HomePage from "./ui/home/home-page";
import Footer from "./ui/navigations/footer";
import MainNavigation from "./ui/navigations/main-navigation";

export default function Page() {
  return (
    <>
      <MainNavigation />
      <HomePage />
      <Footer />
    </>
  );
}
