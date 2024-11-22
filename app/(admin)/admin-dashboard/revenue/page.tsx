import {
  ProfitFetchAll,
  ProfitFetchCurrentMonth,
  ProfitFetchLastMonth,
} from "@/app/api/profit/ProfitFetch";
import RevenueForecast from "@/features/revenue/admin/RevenueForecast";
import TotalRevenue from "@/features/revenue/admin/TotalRevenue";
import Table from "@/features/revenue/components/Table";

import React from "react";

const Page = async () => {
  const profits = await ProfitFetchAll();
  const currentProfit = await ProfitFetchCurrentMonth();
  const lastProfit = await ProfitFetchLastMonth();

  const today = new Date();
  const month = today.toLocaleString("default", { month: "long" });
  const year = today.getFullYear();
  return (
    <>
      <div className="px-10 pt-5">
        <p className="text-xl tracking-wide">
          {month} {year}
        </p>
      </div>
      <main className="grid grid-cols-3 gap-x-4 px-10 py-5">
        <TotalRevenue
          profit={
            currentProfit ?? {
              id: 0,
              profitId: "",
              profit: 0,
              bookings: 0,
              refund: 0,
              month: "",
              year: "",
              updatedAt: new Date(),
              createdAt: new Date(),
            }
          }
          allProfits={profits}
          lastProfit={lastProfit?.profit ?? 0}
        />
        <RevenueForecast profits={profits} />
      </main>
      <Table />
    </>
  );
};

export default Page;
