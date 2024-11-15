"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Admin } from "@/app/lib/types/types";

export function AdminNavigation({ admin }: { admin: Admin }) {
  const path = usePathname();

  const handleSignout = () => {
    console.log("Logout");

    signOut({ callbackUrl: "/" });
  };
  return (
    <nav
      className={
        "flex justify-between items-center py-4 px-24 w-full bg-[#222] text-gray-200"
      }
    >
      <div className="flex justify-start items-center gap-x-5">
        {/* Logo */}
        <Link href={"/"}>
          <Image
            src={"/image/roof-logo.png"}
            alt="Logo"
            height={300}
            width={300}
            className="h-6 w-16"
          />
        </Link>

        <section className="flex justify-end items-center gap-x-6 text-sm border-l border-gray-600 mx-5 px-10 font-medium">
          <Link
            href={"/admin-dashboard"}
            className={`${
              path === "/admin-dashboard"
                ? "py-1.5 px-5 bg-[#333] rounded-md"
                : "py-1.5 px-5"
            } `}
          >
            Overview
          </Link>
          <Link
            href={"/admin-dashboard/reservations"}
            className={`${
              path === "/admin-dashboard/reservations"
                ? "py-1.5 px-5 bg-[#333] rounded-md"
                : "py-1.5 px-5"
            } `}
          >
            Reservations
          </Link>
          <Link
            href={"/admin-dashboard/reviews"}
            className={`${
              path === "/admin-dashboard/reviews"
                ? "py-1.5 px-5 bg-[#333] rounded-md"
                : "py-1.5 px-5"
            } `}
          >
            Reviews
          </Link>
          <Link
            href={"/admin-dashboard/voucher"}
            className={`${
              path === "/admin-dashboard/voucher"
                ? "py-1.5 px-5 bg-[#333] rounded-md"
                : "py-1.5 px-5"
            } `}
          >
            Voucher
          </Link>
          <Link
            href={"/admin-dashboard/special-price"}
            className={`${
              path === "/admin-dashboard/special-date"
                ? "py-1.5 px-5 bg-[#333] rounded-md"
                : "py-1.5 px-5"
            } `}
          >
            Special date
          </Link>
        </section>
      </div>

      <div className="flex items-center text-sm gap-x-5">
        <p className="text-white text-sm font-medium">{admin.username},</p>
        <button className="px-5" onClick={handleSignout}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
