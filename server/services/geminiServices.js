import { GoogleGenerativeAI } from "@google/generative-ai";
const api_key = process.env.Google_Api_Key;
const genAI = new GoogleGenerativeAI(api_key);
const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" })
const textModel =genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: {
                temperature: 0.1, // more factual
                maxOutputTokens: 500
            }

        })

let requestTimes=[];

const waitForRateLimit = async () => {
        const now = Date.now();
        requestTimes =requestTimes.filter(time => now - time < 60000);
        if (requestTimes.length > 14) {
            const oldestRequest = requestTimes[0];
            const timeSinceOldRequest = now - oldestRequest;
            const timeUntilSafe = 60000 - timeSinceOldRequest;// after this time we are safe to request again
            const waitTime = timeUntilSafe + 1000;
            console.log(`⏳ Rate limit: waiting ${waitTime / 1000} seconds`);
            await new Promise(resolve => setTimeout(resolve, waitTime)) // after waitimte resolve is called and primse is resolved 
        }
        requestTimes.push(now);// add this request with the time as now .

    }


export const  generateEmbeddings = async (text,retries=3) => {
        for(let i=0; i< retries ; i++){
            try {
            waitForRateLimit(); // adds the rrquest and checks for rate limit .
                const result = await embeddingModel.embedContent(text)
            return  result.embedding.values;
            } catch (error) {
              console.log(error)
              if(i == retries -1) throw error;
              await new Promise(resolve => setTimeout(resolve , 1000*(i+1)));

            }
        }
    } 

export const generateEmbedding = async(text)=>{
    try {
         const embeddings=[];
        for(let i=0;i<text.length;i++){
          const embedding = await generateEmbeddings(text[i]); // give each line to generateEmbeddong sto generate the emebddgong and saves it into embeddongs array 
          embeddings.push(embedding);
        }
        return embeddings;// and returns it later  
    } catch (error) {
        console.log(error)
        
    }
}

 
export const generateAnswers=async(question, contextChunks)=>{ 
    // we store embedding on order to complete the search and text with embddibgs to provide with the context
    try {
          const context = await contextChunks.map(chunks => chunks.text).join('\n\n');


        // console.log(question);
        // console.log(context, " this is the context");
        
        const prompt = `Context:${context} 
  Question:${question} 
  
  Instructions:
- Answer based ONLY on the provided context
- If the answer isn't in the context, say "I cannot find this information"
- Be concise and accurate
- Mention which part of the context supports your answer

Answer Based on the context : 
`
        const result = await textModel.generateContent(prompt)
        console.log(result)
        return result.response.text();//  because idk text is a function inside response

    } catch (error) {
         console.error(`Answer generation attempt ${attempt} failed:`, error.message);
        
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
    }
   
    }

// test function 
    const testConnection = async()=>{
        try{
             console.log('🧪 Testing Gemini connection...');
      const embedding = await this.generateEmbedding('Hello world test');
      console.log('✅ Embedding test passed, vector length:', embedding.length);
      
      const answer = await this.generateAnswers('What is this?', [{ text: 'This is a test document' }]);
      console.log('✅ Text generation test passed:', answer.substring(0, 50) + '...');
      
      return true;
        
    } catch (error) {
      console.error('❌ Gemini connection test failed:', error.message);
      return false;
    }
}
    