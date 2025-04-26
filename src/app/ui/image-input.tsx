"use client";

import { analyzeImage } from "@/gemini";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaPaste } from "react-icons/fa";
import { FaRegPaste } from "react-icons/fa6";
import { MdAdsClick } from "react-icons/md";
import { RiDragDropLine } from "react-icons/ri";

const ImageInput = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  const [text, setText] = useState<string>("");
  const dropRef = useRef(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop detected.");
    e.preventDefault();
    if (e.dataTransfer.files) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        if (!checkFileSize(file)) {
          return;
        }
        setText("Loading...");
        setImagePreview(URL.createObjectURL(file));
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
          if (!checkFileSize(file)) {
            return;
          }
          setText("Loading...");
          setImagePreview(URL.createObjectURL(file));
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
      setText("Loading...");

      const file = event.target.files[0];
      if (!checkFileSize(file)) {
        return;
      }
      if (file) {
        setImagePreview(URL.createObjectURL(file));
        console.log("Trying to perform OCR on the image...");
        handleResponse(file);
      } else {
        setImagePreview(null);
      }
    }
  };

  function checkFileSize(file: File) {
    if (file.size > 10 * 1024 * 1024) {
      setText("File too large. Please upload an image smaller than 10MB.");
      return false;
    }
    return true;
  }

  useEffect(() => {
    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const boxCss =
    "flex flex-col items-center justify-center p-6 border border-gray-300 rounded-xl hover:shadow-lg transition-shadow duration-300";

  return (
    <div
      className="max-w-5xl mx-auto p-4 bg-white/50  shadow-xl rounded-xl grid lg:grid-cols-2 grid-cols-1 gap-6 transition-all duration-200 hover:shadow-2xl"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      ref={dropRef}
    >
      <div className={boxCss}>
        <form className="w-full h-full border-2 border-dotted border-gray-300 rounded-xl p-6 hover:border-gray-400 transition-all duration-200 flex flex-col gap-4 hover:shadow-lg">
          <label
            htmlFor="fileInput"
            className="flex flex-col items-center justify-center gap-4 cursor-pointer text-gray-600 text-center flex-grow"
          >
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />

            <div className="flex flex-row items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-200">
              <MdAdsClick className="text-xl" />
              <p className="text-lg font-semibold">Click to Upload Image</p>
            </div>

            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <p>or</p>
              <div className="flex flex-row items-center gap-1">
                <RiDragDropLine className="text-base" />
                <p>Drag and drop your image here</p>
              </div>
              <div className="flex flex-row items-center gap-1">
                <FaRegPaste className="text-base" />
                <p>Paste image from clipboard</p>{" "}
              </div>
            </div>
          </label>

          <label className="flex flex-row items-center gap-2 text-gray-700 select-none">
            <input
              type="checkbox"
              checked={showPreview}
              name="imagePreview"
              onChange={() => setShowPreview((prev) => !prev)}
              className="size-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <p>Show Preview</p>
          </label>

          {showPreview && imagePreview && (
            <div className="mt-2">
              <Image
                src={imagePreview}
                alt="Selected preview"
                className="w-full max-w-sm h-auto rounded-lg shadow-md object-cover mx-auto"
                height={200}
                width={200}
              />
            </div>
          )}
        </form>
      </div>
      <div className={`${boxCss} relative`}>
        <textarea
          className="text-gray-800 break-words w-full h-full border-0 active:border-0"
          defaultValue={text.toString()}
          readOnly
          rows={8}
        ></textarea>
        <button
          className="absolute bottom-0 right-0 p-2 transition-colors rounded-tl-xl bg-neutral-200 hover:bg-neutral-400/75 group"
          title="Copy to cliboard."
        >
          <FaPaste
            color="black"
            onClick={() => navigator.clipboard.writeText(text.toString())}
            size={24}
            className="group-active:scale-90 transition-transform"
          />
        </button>
      </div>
    </div>
  );
};

export default ImageInput;
