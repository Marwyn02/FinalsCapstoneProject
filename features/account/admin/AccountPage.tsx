"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Admin } from "@/app/lib/types/types";

import AccountStatistics from "./AccountStatistics";

type CurrentAdmin = {
  id: string;
  adminId: string;
  email: string;
  username: string;
  role: string;
};

const AccountPage = ({
  currentAdmin,
  admins,
}: {
  currentAdmin: CurrentAdmin;
  admins: Admin[];
}) => {
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-medium font-teko">Accounts</h1>
        {currentAdmin.role === "master" && (
          <div className="flex items-center gap-x-3">
            <Link
              href={"/admin-dashboard/account/create"}
              className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
            >
              Create account
              <Plus className="h-4 w-4 ml-1 text-green-600" />
            </Link>
            <Link
              href={"/admin-dashboard/account/archive"}
              className="flex items-center bg-blue-50 hover:bg-stone-100 duration-300 px-4 py-2 rounded-lg text-sm"
            >
              Archived Accounts
            </Link>
          </div>
        )}
      </div>

      <AccountStatistics admins={admins} />
    </section>
  );
};

export default AccountPage;
