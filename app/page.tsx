import { ReviewFetchAll } from "./api/review/ReviewFetch";

import HomeReview from "../features/home/components/HomeReview";
import HomeLanding from "../features/home/components/HomeLanding";
import HomeOverview from "../features/home/components/HomeOverview";
import HomeMap from "@/features/home/components/HomeMap";
import MainNavigation from "@/components/navigation/MainNavigation";
import Footer from "@/components/navigation/Footer";

export default async function Page() {
  const reviews = await ReviewFetchAll();

  return (
    <main className="bg-white text-[#1e2447]">
      <MainNavigation />
      <HomeLanding />
      <HomeOverview />
      <HomeReview reviews={reviews} />
      <HomeMap />
      <Footer />
    </main>
  );
}
