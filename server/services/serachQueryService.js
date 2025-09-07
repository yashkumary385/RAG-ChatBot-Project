
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const api_key = process.env.Google_Api_Key;
console.log("API Key loaded:", api_key ? "✅" : "❌");
import { generateAnswers, generateEmbeddings } from "./geminiservices.js";
import Chunk from "../models/Chunk.js";

const genAI = new GoogleGenerativeAI(api_key);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });

    function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) {
    console.warn('⚠️ Invalid vectors for similarity calculation');
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}


// search for similar chunks
export const searchSimilarChunks = async(question,documentId)=>{
const result = await embeddingModel.embedContent(question)
const questionEmbedding = result.embedding.values
// console.log(questionEmbedding)

const chunks = await Chunk.find({documentId}).populate("documentId", "originalName")
const similarities = chunks.map(chunk=>({...chunk , similarity:cosineSimilarity(chunk.embedding,questionEmbedding)}))
// console.log(similarities)
const topChunks = similarities
.filter(chunks => chunks.similarity > 0.3)
.sort((a,b)=> b.similarity - a.similarity)
.slice(0,3)
console.log(topChunks.length);

return {
    
    query:question,
    results:topChunks
};
}