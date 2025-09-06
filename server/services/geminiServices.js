import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

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

export const generateEmbeddings = async (text, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            await waitForRateLimit(); // FIXED: Added await
            const result = await embeddingModel.embedContent(text);
            // console.log(result,"thi is the result")
            return result.embedding.values;
        } catch (error) {
            console.log(`Embedding attempt ${i + 1} failed:`, error.message);
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
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

export const generateAnswers = async (question, contextChunks) => {
    try {
        await waitForRateLimit(); // FIXED: Added rate limiting for answers too
        
        const context = contextChunks.map(chunks => chunks.text).join('\n\n');
        
        const prompt = `Context: ${context}

Question: ${question}

Instructions:
- Answer based ONLY on the provided context
- If the answer isn't in the context, say "I cannot find this information"
- Be concise and accurate
- Mention which part of the context supports your answer

Answer based on the context:`;

        const result = await textModel.generateContent(prompt);
        return result.response.text();
        
    } catch (error) {
        console.error(`Answer generation failed:`, error.message);
        throw error;
    }
};

// Test function
const testConnection = async () => {
    try {
        console.log('🧪 Testing Gemini connection...');
        
        // Test single embedding
        const testText = ['Hello world test'];
        const embedding = await generateEmbedding(testText);
        console.log('✅ Embedding test passed, vector length:', embedding[0].length);
        
        // Test answer generation
        const answer = await generateAnswers('What is this?', [{ text: 'This is a test document' }]);
        console.log('✅ Text generation test passed:', answer.substring(0, 50) + '...');
        
        return true;
    } catch (error) {
        console.error('❌ Gemini connection test failed:', error.message);
        return false;
    }
};

// Uncomment to test
// testConnection();