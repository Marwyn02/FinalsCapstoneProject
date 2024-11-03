import Link from "next/link";

const Page = () => {
  return (
    <main className="bg-[#fcf4e9] space-y-5">
      <p>Thank you for leaving a review!</p>

      <p>
        Your review will be sent to our admin to review it and post it in our
        review page.
      </p>

      <Link href={"/"}>Go home</Link>
    </main>
  );
};

export default Page;
