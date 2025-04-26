import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prompt } from "../model/prompt.model.js";

// Initialize Gemini once
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// console.log("Gemini API initialized");

export const sendprompt = async (req, res) => {
  const { content } = req.body;
  const userId = req.userId;

  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Prompt is empty" });
  }

  try {
    await Prompt.create({ userId, role: "user", content });

    // Make sure genAI is available here
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text();

    await Prompt.create({ userId, role: "assistant", content: text });

    res.status(200).json({ reply: text });
  } catch (error) {
    console.error("Error in sendprompt:", error);
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};
