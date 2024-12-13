// import { Metadata } from "next";
import { getCurrentUser } from "@/lib/session";

import MainNavigation from "@/components/navigation/MainNavigation";
import Footer from "@/components/navigation/Footer";

// export const metadata: Metadata = {
//   title: "Coastal Charm - Reservations",
//   description: "Generated by create next app",
// };

const MemoriesAndReviewsLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const admin = await getCurrentUser();

  return (
    <main>
      <MainNavigation admin={admin} />
      {children}
      <Footer />
    </main>
  );
};

export default MemoriesAndReviewsLayout;
