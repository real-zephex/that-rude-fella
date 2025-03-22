"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const key = await process.env.KEY;
const genAI = new GoogleGenerativeAI(key!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    "You are an OCR utility. Your sole task is to extract text from the provided image accurately and correct any spelling errors. Return only the extracted and spell-checked text without any additional content, greetings, explanations, or formatting. If no text is detected, return 'no text found'",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export async function analyzeImage(imageData: Uint8Array, mimeType: string) {
  try {
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
  } catch (error) {
    console.error(error);
    return "Error processing image";
  }
}
