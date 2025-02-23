import Image from "next/image";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

import Login from "@/features/auth/components/Login";

const Page = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
  return (
    <main className="grid grid-cols-6 bg-white h-screen">
      <Image
        src={"/image/LoginImage.jpg"}
        alt="Crisanto"
        height={1000}
        width={1000}
        className="w-full h-full col-span-4"
      />
      <Login />
    </main>
  );
};

export default Page;
