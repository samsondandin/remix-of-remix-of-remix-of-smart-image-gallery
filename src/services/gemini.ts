import { GoogleGenerativeAI } from "@google/generative-ai";

// Replace with your actual Gemini API Key
const genAI = new GoogleGenerativeAI("YOUR_GEMINI_API_KEY");

export const classifyWithGemini = async (base64Image: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = "Classify this image into one of these categories: portrait, animal, vehicle, landscape, document, screenshot, food, architecture, or other. Return ONLY the category name.";

  const result = await model.generateContent([
    prompt,
    { inlineData: { data: base64Image.split(',')[1], mimeType: "image/jpeg" } }
  ]);
  
  return result.response.text().toLowerCase().trim();
};

export const chatWithGemini = async (message: string, context: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const chat = model.startChat({
    history: [
      { role: "user", parts: [{ text: `You are SmartGallery AI. Here is the library context: ${context}` }] },
      { role: "model", parts: [{ text: "Understood. I can help find images or answer questions about this gallery." }] },
    ],
  });

  const result = await chat.sendMessage(message);
  return result.response.text();
};