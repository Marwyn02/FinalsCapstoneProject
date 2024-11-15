"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import ThemedLink from "./ThemedLink";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const MainNavigation = () => {
  const path = usePathname();

  const [scrolled, setScrolled] = useState(false);

  // Scroll changes
  useEffect(() => {
    const handleScroll = () => {
      if (path === "/") {
        const scrollPosition = window.scrollY;
        if (scrollPosition > 1) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [path]);

  return (
    <nav
      className={`fixed z-50 flex justify-between lg:grid lg:grid-cols-3 items-center py-3 px-5 md:px-28 w-full duration-300 ${
        path !== "/"
          ? "text-black fixed md:relative py-3 md:py-2 bg-white"
          : "text-gray-200 sm:bg-transparent md:py-0"
      } ${scrolled ? "md:bg-[#222] bg-white" : "bg-white"}`}
    >
      {/* Logo */}
      <div className="flex justify-start items-center col-span-1 col-start-1">
        <Link href={"/"}>
          <Image
            src={"/image/logo-head.png"}
            alt="Logo"
            height={800}
            width={800}
            className="h-8 w-16 md:h-10 md:w-20"
          />
        </Link>
      </div>

      {/* Sections pages */}
      <section className="hidden lg:flex justify-end items-center gap-x-4 col-span-2 text-[15px] font-medium">
        <Link
          href={"/"}
          className={path === "/" ? "underline font-bold px-5" : "px-5 py-4"}
        >
          Home
        </Link>
        <Link
          href={"/amenities"}
          className={
            path.startsWith("/amenities")
              ? "underline font-bold px-5"
              : "px-5 py-4"
          }
        >
          Amenities
        </Link>
        <Link
          href={"/services"}
          className={
            path.startsWith("/services")
              ? "underline font-bold px-5"
              : "px-5 py-4"
          }
        >
          Services
        </Link>
        <Link
          href={"/memories-and-reviews"}
          className={
            path.startsWith("/memories-and-reviews")
              ? "underline font-bold px-5"
              : "px-5 py-4"
          }
        >
          Memories & Reviews
        </Link>
        <Link
          href={"/contact"}
          className={
            path.startsWith("/contact")
              ? "underline font-bold px-5"
              : "px-5 py-4"
          }
        >
          Contact us
        </Link>
        <Link
          href={"reservations"}
          className={
            path.startsWith("/reservations")
              ? "underline font-bold "
              : "bg-yellow-400 px-5 py-4 text-[#222] font-semibold hover:bg-[#555] hover:text-white duration-300"
          }
        >
          Book now
        </Link>
      </section>

      {/* Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            type="button"
            className="col-start-2 col-span-1 lg:hidden flex justify-end items-center w-auto bg-transparent border-0 hover:bg-transparent hover:opacity-60 hover:border-0 duration-300 focus:outline-none"
          >
            <Image src="/icon/Burger.svg" alt="menu" height={25} width={25} />
            <p className="hidden md:block indent-2 text-[#2A3242] text-sm font-light tracking-widest duration-300">
              MENU
            </p>
          </Button>
        </SheetTrigger>
        <SheetContent side={"left"} className="px-0">
          <SheetHeader>
            <SheetTitle className="grid items-start text-[#2A3242] tracking-wider text-start uppercase border-b px-5 pb-5 mb-8">
              <p className="font-medium font-teko text-4xl">Crisanto</p>
              <p className="font-light text-sm"> Transient House</p>
            </SheetTitle>
            <section className="grid grid-row space-y-8 text-lg text-start px-5 text-slate-500 dark:text-slate-400">
              <ThemedLink src={"/"} title={"Home"} />
              <ThemedLink src={"/amenities"} title={"Amenities"} />
              <ThemedLink src={"/services"} title={"Services"} />
              <ThemedLink
                src={"/memories-and-reviews"}
                title={"Memories & Reviews"}
              />
              <ThemedLink src={"/contact"} title={"Contact us"} />
              <ThemedLink src={"/reservations"} title={"Book now"} />
            </section>
          </SheetHeader>
          <SheetFooter></SheetFooter>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MainNavigation;
