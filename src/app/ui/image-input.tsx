"use client";

import { analyzeImage } from "@/gemini";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaPaste } from "react-icons/fa";

const ImageInput = () => {
  const [fileName, setFileName] = useState("No file chosen");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const dropRef = useRef(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    console.log("Drop detected.");
    e.preventDefault();
    if (e.dataTransfer.files) {
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) {
        setText("Loading...");
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
          setText("Loading...");
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
      setText("Loading...");
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
        <p className="text-gray-700 mb-4">
          Upload an image to extract the text and display it here.
        </p>
        <form className="w-full">
          <label className="flex items-center gap-3 cursor-pointer bg-gray-300 rounded-xl">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <span className="bg-blue-600 text-white px-5 py-2 rounded-l-lg hover:bg-blue-700 transition active:scale-95">
              Upload Image
            </span>
            <span className="text-gray-500 text-sm">
              {fileName.length < 25
                ? fileName
                : fileName.substring(0, 20) + "..."}
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
