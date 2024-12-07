"use client";

import React from "react";
import { Profit } from "@/app/lib/types/types";

const TotalRevenue = ({
  profit,
  allProfits,
  lastProfit,
}: {
  profit: Profit;
  allProfits: Profit[];
  lastProfit: number;
}) => {
  // Get the percentage of the increase or decrease of monthly revenue
  const percentageChange = React.useMemo(() => {
    if (lastProfit === 0) {
      return profit.profit > 0 ? 100 : 0;
    }

    const change = ((profit.profit - lastProfit) / lastProfit) * 100;
    return Number(change.toFixed(1));
  }, []);

  // Get the month with the highest revenues
  const highestRevenueMonth = React.useMemo(() => {
    if (!allProfits || allProfits.length === 0) return null;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Find the profit with the highest revenue
    const maxProfit = allProfits.reduce((max: Profit, profit: Profit) =>
      profit.profit > max.profit ? profit : max
    );

    return {
      ...maxProfit,
      monthName: monthNames[Number(maxProfit.month) - 1],
    };
  }, []);

  // Calculate the total revenue from all months
  const totalRevenue = React.useMemo(() => {
    if (!allProfits || allProfits.length === 0) return 0;
    // Sum all the profits from each month
    return allProfits.reduce((total: number, profit: Profit) => {
      return total + profit.profit;
    }, 0);
  }, [allProfits]);

  return (
    <div className="col-span-2 space-y-5">
      <div className="bg-gradient-to-br from-[#dbb07c] to-[#f7c995] space-y-5 p-5 rounded-xl">
        <h1 className="text-white text-lg">Overall Revenue</h1>

        <div className="space-y-3">
          <p className="text-5xl font-semibold text-white">
            {profit.profit.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{" "}
            PHP
          </p>

          <div className="flex items-center gap-x-1">
            <p
              className={`text-[#373737] px-2 py-0.5 rounded-full max-w-min ${
                percentageChange >= 0 ? "bg-[#C7DFC5]" : "bg-[#FFC2C2]"
              }`}
            >
              {percentageChange > 0 && "+"}
              {percentageChange}%
            </p>

            <p className="text-white">
              {percentageChange >= 0
                ? "Than last month"
                : "Lower than last month"}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-400 space-y-1 p-5 rounded-xl hover:bg-gray-100 duration-300">
        <h2>Seasonal Revenue Trends</h2>

        {highestRevenueMonth ? (
          <div>
            <p className="text-2xl font-semibold text-[#dbb07c]">
              {highestRevenueMonth.monthName}
            </p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <div className="bg-white border border-gray-400 space-y-1 p-5 rounded-xl">
        <h2>Total Year Revenue</h2>

        {totalRevenue > 0 ? (
          <div>
            <p className="text-2xl font-semibold text-[#dbb07c]">
              {totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              PHP
            </p>
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default TotalRevenue;
