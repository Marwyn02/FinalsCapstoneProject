"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 text-white px-5 md:px-40 py-6 bg-[#010101]">
      {/* Title and contacts */}
      <div className="space-y-3 col-span-2 md:col-span-1">
        <div>
          {" "}
          <h2 className="text-3xl md:text-xl uppercase font-medium tracking-wide font-teko">
            Crisanto
          </h2>
          <p className="text-xs md:text-[10px] leading-2 md:leading-3 font-light uppercase tracking-widest -mt-1 text-gray-300">
            Transient <br />
            House
          </p>
        </div>

        <div className="text-sm text-gray-300">
          <p className="font-bold">La Union, Philippines</p>
          <p>(+63) 995 488 0496</p>
          <p>(+63) 956 394 3377</p>
          <p>crisantotransienthouse@gmail.com</p>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-100">
        <p>About us</p>
        <p>Contact</p>
        <p>Terms & Conditions</p>
      </div>

      <div className="text-gray-100 space-y-2 text-sm">
        <div className="flex items-center gap-x-4">
          <Facebook fill="#f3f4f6" className="h-4 w-4" />
          <p>Facebook</p>
        </div>

        <div className="flex items-center gap-x-4">
          <Twitter fill="#f3f4f6" className="h-4 w-4" />
          <p>Twitter</p>
        </div>

        <div className="flex items-center gap-x-4">
          <Instagram className="h-4 w-4" />
          <p>Instagram</p>
        </div>
      </div>

      <div className="text-sm text-gray-200 space-y-2 col-span-2 md:col-span-1">
        <p className="font-bold">Subscribe to our newsletter:</p>
        <div className="flex">
          <Input
            placeholder="Email Address"
            className="bg-transparent placeholder:text-gray-200"
          />
          <button className="bg-yellow-400 px-6 text-xs font-bold text-gray-800">
            OK
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
