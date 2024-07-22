import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main>
      <nav
        className={
          "fixed z-10 text-[#9da6b7] bg-white group w-full h-10 md:h-16 px-8 md:px-10 pb-4 pt-2.5 duration-500" // not scrolled hover:bg-[#FFD493]
        }
      >
        <section className="grid grid-cols-2 justify-between md:grid-cols-3 md:justify-center items-center">
          <div className="hidden md:flex md:order-3 md:text-end md:justify-end">
            {/* <AuthNavBar user={user} /> */}
          </div>

          <div></div>
          {/* <CoastalCharmLogo /> */}

          <div className="flex justify-start text-black">
            <Link href={"/reservations"}>Reserve</Link>
            {/* <NavSheetButton /> */}
          </div>
        </section>
      </nav>

      <Image
        src={"/image/Main-Image.jpg"}
        alt="Landing page image"
        height={1000}
        width={1000}
        className="h-screen w-full"
      />

      <div className="absolute h-screen w-full px-8 md:px-10 inset-0 flex items-center justify-center">
        <h1 className="text-slate-100 text-center text-5xl md:text-5xl font-bold">
          Creating Memories, One Stay at a Time.
        </h1>
      </div>
    </main>
  );
}
