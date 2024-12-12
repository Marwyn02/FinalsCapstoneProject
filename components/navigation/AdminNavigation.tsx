"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LoaderCircle } from "lucide-react";
import { Admin } from "@/app/lib/types/types";
import { AccountLogout } from "@/features/auth/api/AccountLogout";

export function AdminNavigation({ admin }: { admin: Admin }) {
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const handleSignout = async (adminId: string, username: string) => {
    setIsLoading(true);
    await AccountLogout(adminId);
    // await AccountLogout(adminId, username);
    signOut();
    setIsLoading(false);
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

        <section className="flex justify-end items-center gap-x-2 text-sm border-l border-gray-600 mx-3 px-10 font-medium">
          <Link
            href={"/admin-dashboard"}
            className={`${
              path === "/admin-dashboard"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Overview
          </Link>
          {admin && admin.role === "master" && (
            <Link
              href={"/admin-dashboard/revenue"}
              className={`${
                path === "/admin-dashboard/revenue"
                  ? "py-1.5 px-3 bg-[#333] rounded-md"
                  : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
              } `}
            >
              Revenue
            </Link>
          )}
          <Link
            href={"/admin-dashboard/reservations"}
            className={`${
              path === "/admin-dashboard/reservations"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Reservations
          </Link>
          <Link
            href={"/admin-dashboard/reviews"}
            className={`${
              path === "/admin-dashboard/reviews"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Reviews
          </Link>
          <Link
            href={"/admin-dashboard/image"}
            className={`${
              path === "/admin-dashboard/image"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Image
          </Link>
          <Link
            href={"/admin-dashboard/voucher"}
            className={`${
              path === "/admin-dashboard/voucher"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Voucher
          </Link>
          <Link
            href={"/admin-dashboard/special-price"}
            className={`${
              path === "/admin-dashboard/special-price"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Special date
          </Link>
          <Link
            href={"/admin-dashboard/account"}
            className={`${
              path === "/admin-dashboard/account"
                ? "py-1.5 px-3 bg-[#333] rounded-md"
                : "py-1.5 px-3 hover:bg-[#555] duration-300 rounded-md"
            } `}
          >
            Account
          </Link>

          {/* {admin && admin.role === "master" && (
            <Link
              href={"/admin-dashboard/audit"}
              className={`${
                path === "/admin-dashboard/audit"
                  ? "py-1.5 px-5 bg-[#333] rounded-md"
                  : "py-1.5 px-5 hover:bg-[#555] duration-300 rounded-md"
              } `}
            >
              Logs
            </Link>
          )} */}
        </section>
      </div>

      <div className="flex items-center text-sm gap-x-5">
        <p className="text-white text-sm font-medium capitalize">
          {admin.username},
        </p>
        <button
          className="py-1.5 px-5 hover:bg-[#777] duration-300 rounded-md text-center"
          onClick={() => handleSignout(admin.adminId, admin.username)}
          disabled={isLoading}
        >
          {!isLoading ? (
            "Sign out"
          ) : (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          )}
        </button>
      </div>
    </nav>
  );
}
