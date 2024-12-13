"use client";

import { useState } from "react";

const ImageUploadForm = () => {
  const [image, setImage] = useState<File | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!image) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("/api/image", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      alert("Upload failed!");
      return;
    }

    await res.json();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
        required
      />
      <button type="submit">Upload</button>
    </form>
  );
};

export default ImageUploadForm;
