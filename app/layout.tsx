import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import { ErrorBoundary } from "react-error-boundary";
// import Error from "./error";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crisanto Transient House",
  description:
    "Welcome to Crisanto Transient House, your cozy and affordable home away from home, just 15 minutes from the stunning beaches of San Fernando, La Union. Whether you're visiting for a weekend getaway or an extended stay, enjoy the comfort and convenience of our fully equipped accommodations in a peaceful setting, close to the beauty of the coast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

/* <MainNavigation /> */
/* <ErrorBoundary fallback={<Error />}>
<>{children}</>
</ErrorBoundary> */
