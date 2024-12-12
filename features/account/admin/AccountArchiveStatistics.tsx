"use client";

import React from "react";
import Link from "next/link";
import { Admin } from "@/app/lib/types/types";
import { ChevronLeft } from "lucide-react";

const AccountArchiveStatistics = ({ admins }: { admins: Admin[] }) => {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-medium font-teko">Archived Accounts</h1>
        <div className="flex items-center gap-x-3">
          <Link
            href={"/admin-dashboard/account"}
            className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Accounts
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-4 divide-x-[1px] divide-gray-400 gap-x-5">
        <div className="col-span-1 space-y-3">
          <h2>Total Archived Accounts</h2>

          <div className="flex items-center gap-x-4">
            <p className="font-medium text-4xl">{admins.length}</p>
          </div>
        </div>
        <div className="col-span-3"></div>
      </div>
    </section>
  );
};

export default AccountArchiveStatistics;
