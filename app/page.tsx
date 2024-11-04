import { ReviewFetchAll } from "./api/review/ReviewFetch";

import { MainNavigation, Footer } from "./ui/navigation/navigation";
import HomeReview from "./ui/home/HomeReview";
import HomeLanding from "./ui/home/HomeLanding";
import HomeOverview from "./ui/home/HomeOverview";

export default async function Page() {
  const reviews = await ReviewFetchAll();

  return (
    <main className="bg-white text-[#1e2447]">
      <MainNavigation />
      <HomeLanding />
      <HomeOverview />
      <HomeReview reviews={reviews} />
      <Footer />
    </main>
  );
}
