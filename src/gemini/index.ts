"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const key = await process.env.KEY;
const genAI = new GoogleGenerativeAI(key!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are an OCR utility. Your sole task is to extract and return the text from the provided image accurately. Do not generate any additional content, greetings, explanations, or formatting beyond the extracted text. If nothing detected, return no text found",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function analyzeImage(imageData: Uint8Array, mimeType: string) {
  const chatSession = model.startChat({
    generationConfig,
    history: [],
  });

  const result = await chatSession.sendMessage([
    {
      inlineData: {
        mimeType: mimeType,
        data: Buffer.from(imageData).toString("base64"),
      },
    },
  ]);

  console.log(result.response.text());
  return result.response.text();
}
