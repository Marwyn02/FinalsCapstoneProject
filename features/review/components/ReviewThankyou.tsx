"use client";

import Link from "next/link";
import React from "react";

const ReviewThankyou = () => {
  return (
    <div className="h-screen text-center col-span-2 pt-20 px-5">
      <div>
        <p className="font-teko font-medium text-5xl text-black">
          Thank you for your feedback!
        </p>
        <p>
          Thank you for taking the time to share your thoughts. We appreciate
          your feedback!
        </p>
      </div>

      <Link
        href={"/"}
        className="font-semibold underline text-sm hover:text-gray-600 duration-300"
      >
        Go to home
      </Link>
    </div>
  );
};

export default ReviewThankyou;
