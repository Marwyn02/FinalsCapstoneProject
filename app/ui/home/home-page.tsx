"use client";

import React from "react";
import Image from "next/image";
import MainNavigation from "../navigations/main-navigation";

// import ChatBot from "./ui/reservations/chat-bot";

export default function HomePage({ user }: any) {
  return (
    <>
      <div className="relative">
        <Image
          src={"/image/hero.jpg"}
          alt="Landing page image"
          height={1000}
          width={1000}
          className="w-full h-[380px] object-cover brightness-75 contrast-125"
        />

        <div className="absolute pt-[64px] px-5 md:px-10 inset-0 flex items-center justify-start text-white">
          <div className="-space-y-1">
            <h1 className="text-slate-100 font-light text-lg md:tracking-widest uppercase">
              {/* Creating Memories, One Stay at a Time. */}
              Welcome to
            </h1>
            <p className="text-5xl md:text-6xl uppercase font-bold">Crisanto</p>
            <p className="text-lg tracking-[0.3em] uppercase">
              Transient House
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 py-10 text-gray-600 text-sm space-y-2">
        <p>
          Conveniently located near beautiful beaches in La Union, Crisanto
          transient House is the perfect spot for a peaceful getaway, offering a
          range of exciting features, including a free Wi-Fi, wide parking, a
          fully equipped main kitchen and a separate dirty kitchen for heavier
          cooking tasks, etc.
        </p>
        <p>
          Experience a relaxing getaway with our transient house, designed
          specifically for your comfort and relaxation. Escape the routine of
          everyday life and discover your own private paradise.
        </p>
      </div>
    </>
  );
}
