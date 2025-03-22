import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ImageToOCR Utility",
  description:
    "A web application that extracts text from images using Google Generative AI. Upload an image and get accurate OCR results instantly.",
  keywords: [
    "OCR",
    "Image to Text",
    "Google Generative AI",
    "Next.js",
    "React",
    "Image Processing",
    "Text Extraction",
  ],
  authors: [{ name: "zephex", url: "https://zephex.netlify.app" }],
  creator: "zephex",
  publisher: "zephex",
  openGraph: {
    title: "ImageToOCR Utility",
    description:
      "Extract text from images with ease using our ImageToOCR Utility powered by Google Generative AI.",
    url: "https://rude-ocr.vercel.app",
    siteName: "ImageToOCR Utility",
    images: [
      {
        url: "https://rude-ocr.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "ImageToOCR Utility",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ImageToOCR Utility",
    description:
      "Extract text from images with ease using our ImageToOCR Utility powered by Google Generative AI.",
    images: ["https://rude-ocr.vercel.app/og-image.png"],
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
