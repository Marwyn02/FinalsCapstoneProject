/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useMemo, useState } from "react";
import { Profit } from "@/app/lib/types/types";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const RevenueForecast = ({ profits }: { profits: Profit[] }) => {
  const [selectedYear, setSelectedYear] = useState("2024");

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

  // Generate a full list of months (January - December)
  const allMonths = monthNames.map((month, index) => ({
    month: (index + 1).toString(), // Store month as string (1-12)
    name: month,
  }));

  const chartData = useMemo(() => {
    const monthsWithProfits = allMonths.map((month) => {
      const profitForMonth = profits.find(
        (profit) => profit.year === selectedYear && profit.month === month.month
      );
      return {
        name: month.name,
        Profit: profitForMonth ? profitForMonth.profit : 0,
      };
    });
    return monthsWithProfits;
  }, [selectedYear, profits]);

  return (
    <div className="col-start-3 col-span-full w-full">
      <section className="bg-white p-6 border border-gray-400 rounded-2xl">
        <div className="flex justify-start gap-x-4 items-center p-5">
          <Select
            onValueChange={(value) => setSelectedYear(value)}
            defaultValue={selectedYear}
          >
            <SelectTrigger className="w-[100px] h-10 text-base">
              <SelectValue placeholder="Select Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xl tracking-wide font-medium">Revenue</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            width={500}
            height={400}
            data={chartData}
            margin={{
              top: 10,
              right: 20,
              left: 20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Profit"
              stroke="#8884d8"
              fill="#DBB07C"
            />
          </AreaChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default RevenueForecast;
