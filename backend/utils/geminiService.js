const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const embeddingModel = genAI.getGenerativeModel({ model: 'models/text-embedding-004' });

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

/**
 * Generates content based on a given prompt.
 * @param {string} prompt - The text prompt to send to the Gemini model.
 * @returns {Promise<string>} The generated text response.
 */
const generateContent = async (prompt) => {
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to generate AI content.');
  }
};

/**
 * Creates a vector embedding for a given text.
 * @param {string} text - The text to embed.
 * @returns {Promise<number[]>} The vector embedding.
 */
const createEmbedding = async (text) => {
  const result = await embeddingModel.embedContent(text);
  return result.embedding.values;
};

module.exports = { generateContent, createEmbedding };