import express from "express"
import { searchSimilarChunks } from "../services/serachQueryService.js";
import { generateAnswers } from "../services/geminiservices.js";
const router = express.Router();


router.post("/",async(req,res)=>{
    const {question , documentId} = req.body;
    try {
  const searchResults =await searchSimilarChunks(question, documentId);
// console.log(searchResults)

const contextChunks = searchResults.results.map(chunk => chunk._doc.text);
//   console.log(contextChunks)
const answer = await generateAnswers(question,contextChunks);
console.log(answer)
res.json({
    question,answer
})
    } catch (error) {
        console.log(error)
    }
    
})
export default router