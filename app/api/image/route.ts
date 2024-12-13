"use server";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { uploadToCloudinary } from "../cloudinary/UploadToCloudinary";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("image") as File | null;
  const author = formData.get("author") as string;

  if (!file) {
    return new Response(
      JSON.stringify({ success: false, message: "No image provided" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const buffer = await file.arrayBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  const mimeType = file.type;
  const encoding = "base64";

  const fileUri = "data:" + mimeType + ";" + encoding + "," + base64;

  const res = await uploadToCloudinary(fileUri, file.name);

  if (res.success && res.result) {
    await prisma.image.create({
      data: {
        url: res.result.secure_url,
        fileName: res.result.original_filename,
        publicId: res.result.public_id,
        author: author,
        status: "pending",
      },
    });

    return NextResponse.json({
      message: "success",
      imgUrl: res.result.secure_url,
    });
  } else return NextResponse.json({ message: "failure" });
}
