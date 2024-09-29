"use client";

import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";
import React from "react";

export default function Footer() {
  return (
    <footer className="grid grid-cols-4 text-white px-40 py-6 bg-[#010101]">
      {/* Title and contacts */}
      <div className="space-y-3">
        <div>
          {" "}
          <h2 className="text-xl uppercase font-bold">Crisanto</h2>
          <p className="text-[10px] leading-3 font-light uppercase tracking-widest -mt-1 text-gray-300">
            Transient <br />
            House
          </p>
        </div>

        <div className="text-sm text-gray-300">
          <p>La Union, Philippines</p>
          <p>(+63) 995 488 0496</p>
          <p>(+63) 956 394 3377</p>
          <p>crisantotransienthouse@gmail.com</p>
        </div>
      </div>

      <div className="space-y-3 text-sm text-gray-100">
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

      <div className="text-sm text-gray-200 space-y-5">
        <p>Subscribe to our newsletter</p>
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
}
