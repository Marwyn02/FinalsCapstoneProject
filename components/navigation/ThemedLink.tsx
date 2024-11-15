"use client";

import React from "react";
import Link from "next/link";

import { ChevronRight } from "lucide-react";

const ThemedLink = ({ src, title }: { src: string; title: string }) => {
  return (
    <Link
      href={src}
      className="flex justify-between items-center tracking-widest text-sm text-gray-600 uppercase hover:text-black hover:underline underline-offset-2 duration-300"
    >
      <p>{title}</p>
      <ChevronRight size={20} />
    </Link>
  );
};

export default ThemedLink;
