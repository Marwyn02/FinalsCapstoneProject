import Login from "@/app/ui/auth/login";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }
  return (
    <main className="grid grid-cols-6 bg-white h-screen">
      <></>
      <Login />
    </main>
  );
};

export default Page;
