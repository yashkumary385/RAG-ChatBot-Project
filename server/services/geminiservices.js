import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}
const api_key = process.env.Google_Api_Key;
console.log("API Key loaded:", api_key ? "✅" : "❌");

const genAI = new GoogleGenerativeAI(api_key);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
const textModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 500
    }
});

let requestTimes = [];
const maxRequestsPerMinute = 14;

// FIXED: Added await here
const waitForRateLimit = async () => {
    const now = Date.now();
    requestTimes = requestTimes.filter(time => now - time < 60000);
    
    if (requestTimes.length >= maxRequestsPerMinute) {
        const waitTime = 60000 - (now - requestTimes[0]) + 1000;
        console.log(`⏳ Rate limit: waiting ${Math.round(waitTime/1000)}s`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    requestTimes.push(now);
};

export const generateEmbeddings = async (texts, retries = 3) => {
    const embeddings = [];

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            for (let i = 0; i < texts.length; i++) {
                await waitForRateLimit(); // throttle API
                const result = await embeddingModel.embedContent(texts[i]); // ✅ pass single chunk
                embeddings.push(result.embedding.values); // push full vector
            }
            return embeddings; // return array of vectors
        } catch (error) {
            console.log(`Embedding attempt ${attempt + 1} failed:`, error.message);
            if (attempt === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
        }
    }
};


// IMPROVED: Better progress tracking
// export const generateEmbedding = async (textArray) => {
//     try {
//         const embeddings = [];
//         console.log(`🧠 Generating embeddings for ${textArray.length} chunks...`);
        
//         for (let i = 0; i < textArray.length; i++) {
//             console.log(`📊 Processing chunk ${i + 1}/${textArray.length} (${Math.round(((i+1)/textArray.length)*100)}%)`);
//             console.log(textArray[i]);
//             const embedding = await generateEmbeddings(textArray[i]);
//             embeddings.push(embedding);
            
//             // Show estimated time remaining
//             if (i === 0) {
//                 const estimatedTotal = textArray.length * 5; // ~5 seconds per chunk
//                 console.log(`⏱️ Estimated total time: ~${Math.round(estimatedTotal/60)} minutes`);
//             }
//         }
        
//         console.log(`✅ All ${embeddings.length} embeddings generated!`);
//         return embeddings;
//     } catch (error) {
//         console.error("❌ Error generating embeddings:", error);
//         throw error;
//     }
// };

export const generateAnswers = async (question, context) => {
    try {
        await waitForRateLimit(); // FIXED: Added rate limiting for answers too
        
        // const context = contextChunks.map(chunks => chunks.text).join('\n\n');
        
        const prompt = `Context: ${context}

Question: ${question}

Instructions:
- Answer based ONLY on the provided context 
- If the answer isn't in the context, say "I cannot find this information . It is not stated in the provided files"
- Be concise and accurate 
- Mention which part of the context supports your answer
// - Answer the following question in clear bullet points:



Answer based on the context:`;

        const result = await textModel.generateContent(prompt);
        const answer =  cleanResponseText( result.response.text())
        // const sentences = answer.match(/[^.!?]+[.!?]*/g) || [];
// const bullets = sentences
//   .map(s => s.trim())
//   .filter(Boolean)
//   .map(s => `- ${s}`)
//   .join('\n');

        // cleanResponseText(answer);
        return answer;
        
    } catch (error) {
        console.error(`Answer generation failed:`, error.message);
        throw error;
    }
};

const cleanResponseText = (text) => {
    return text
        // Remove excessive newlines and replace with single spaces
        .replace(/\n+/g, ' ')
        // Remove excessive spaces
        .replace(/\s+/g, ' ')
        // Remove leading/trailing whitespace
        .trim()
        // Remove any markdown formatting that might appear
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\*(.*?)\*/g, '$1')     // Remove italic formatting
        // Fix common formatting issues
        .replace(/\s+\./g, '.') // Fix space before periods
        .replace(/\s+,/g, ',')  // Fix space before commas
        // Ensure proper spacing after periods
        .replace(/\.([A-Z])/g, '. $1');
};

