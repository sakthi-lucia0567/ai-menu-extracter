"use client";

import { useState } from "react";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  confidence: number | null;
  createdAt: string;
}

interface FileUploadProps {
  onExtracted?: (items: MenuItem[]) => void; // callback
}

export default function FileUpload({ onExtracted }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt")) {
      setMessage("Please upload a .txt file");
      return;
    }

    setIsUploading(true);
    setMessage("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload-and-process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Success! Extracted ${data.savedCount} menu items.`);
        if (onExtracted) {
          onExtracted(data.menuItems || []); // pass preview items to Home
        }
      } else {
        setMessage("❌ Processing failed: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🍕 Menu Extractor AI
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6">
        <input
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          id="file-upload"
        />

        <label
          htmlFor="file-upload"
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-lg font-medium transition duration-200 inline-block mb-3"
        >
          {isUploading ? "⏳ Processing with AI..." : "📁 Choose TXT File"}
        </label>

        <p className="text-gray-600 text-sm">
          Upload a .txt file (WhatsApp chats, menus, etc.). AI will extract
          items automatically.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.includes("✅")
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
}
