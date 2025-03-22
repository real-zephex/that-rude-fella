"use client";

import { analyzeImage } from "@/gemini";
import Image from "next/image";
import { JSX, useState, useRef, useEffect } from "react";
import { FaPaste } from "react-icons/fa";

const ImageInput = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState<string | JSX.Element>("");
  const dropRef = useRef(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop detected.");
    e.preventDefault();
    if (e.dataTransfer.files) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        setText(<span className="loading loading-bars loading-lg"></span>);
        setImagePreview(URL.createObjectURL(file));
        setFileName(file.name);
        handleResponse(file);
      }
    }
  };

  const handlePaste = (e: ClipboardEvent) => {
    console.log("Paste detected.");
    e.preventDefault();

    const items = e.clipboardData!.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) {
          setText(<span className="loading loading-bars loading-lg"></span>);
          setImagePreview(URL.createObjectURL(file));
          setFileName(file.name);
          handleResponse(file);
          break;
        }
      }
    }
  };

  const handleResponse = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const imageData = new Uint8Array(buffer);

    try {
      const extractedText = await analyzeImage(imageData, file.type);
      setText(extractedText);
    } catch (error) {
      console.error("Error analyzing image:", error);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      setText(<span className="loading loading-bars loading-lg"></span>);
      const file = event.target.files[0];
      setFileName(file ? file.name : "No file chosen");
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        console.log("Trying to perform OCR on the image...");
        handleResponse(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div
      className="max-w-4xl mx-auto p-4 bg-white shadow-xl rounded-xl grid lg:grid-cols-2 grid-cols-1 gap-6 transition-all duration-300"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      ref={dropRef}
    >
      <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300">
        <p className="text-gray-700 mb-4">
          Upload an image to extract the text and display it here.
        </p>
        <form className="w-full">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <span className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition active:scale-95">
              Upload Image
            </span>
            <span className="text-gray-500 text-sm">
              {fileName.length < 25
                ? fileName
                : fileName.substring(0, 15) + "..."}
            </span>
          </label>
          {imagePreview && (
            <div className="mt-4">
              <Image
                src={imagePreview}
                alt="Selected preview"
                className="w-52 lg:w-72 rounded-lg shadow-md"
                height={200}
                width={200}
              />
            </div>
          )}
        </form>
      </div>
      <div className="flex flex-col items-center justify-center p-6 border border-gray-200 rounded-xl hover:shadow-lg transition-shadow duration-300 relative">
        <p className="text-gray-800 text-center break-words">{text}</p>
        <FaPaste
          color="black"
          className="absolute bottom-0 right-0 m-4 hover:bg-gray-500 transition-colors"
          onClick={() => navigator.clipboard.writeText(text.toString())}
          size={24}
        />
      </div>
    </div>
  );
};

export default ImageInput;
