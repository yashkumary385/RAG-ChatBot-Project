import express from "express"
import { searchSimilarChunks } from "../services/serachQueryService.js";
import { generateAnswers } from "../services/geminiServices.js";
// import QueryCache from "../models/QueryCache.js";
import QueryCache from "../models/QueryCache.js"
const router = express.Router();


router.post("/",async(req,res)=>{
    console.log("question route hitt")
    const {question , documentId} = req.body;
    try {
        let cached = await QueryCache.findOne({query:question})
        if(cached){
          return  res.json({answer:cached.answer , cached:true})
        }
  const searchResults =await searchSimilarChunks(question, documentId);
// console.log(searchResults)

const contextChunks = searchResults.results.map(chunk => chunk._doc.text);
//   console.log(contextChunks)
const answer = await generateAnswers(question,contextChunks);
console.log(answer)
 await QueryCache.create({
    query:question,
    answer:answer
})


res.json({
    question,answer,cached:false
})
    } catch (error) {
        res.json(error)
        console.log(error)
    }
    
})
export default router