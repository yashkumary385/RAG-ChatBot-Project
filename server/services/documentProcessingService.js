// Simple pipeline: Document -> Chunks -> Embeddings -> Database
import Chunk from "../models/Chunk.js";
import Document from "../models/Document.js"
import { fixedSizeChunking } from "./chunkingService.js";
import { generateEmbeddings } from "./geminiservices.js";
// processing the document  savining chunks in the database along with the embeddings 
const processDocument = async (documentId) => {

    try {
           const document = await Document.findById(documentId);
    if (!document) {
        throw new Error('Document not found');
    }
    document.processingStatus = "processing";
    await document.save();

    // chunking service from chunking js ( we use fixed size chunking )
    const chunks = fixedSizeChunking(document.content);
    console.log(`✂️ Created ${chunks.length} chunks`);
// console.log(chunks)

    // now we generate embeddings
const texts = chunks.map(i=> i.text)

    // console.log(texts)
    
    // for (let i = 0; i < chunks.length; i++) {
        // console.log(chunks[i].text," this is chunk text") 
        const embeddings = await generateEmbeddings(texts);// we get a whole embeddings array an loop through chunks add chunk text and embeddinga to the dic and store it in db
        //    console.log(embeddings[0])
        // chunkWithEmbeddings.push({
        //     documentId: document._id,
        //     text: chunks[i].text,
        //     embedding: embeddings,
        //     chunkIndex: i
        // };
      
        
      const chunkWithEmbeddings = chunks.map((chunk, i) => ({
    documentId: document._id,
    text: chunk.text,
    embedding: embeddings[i], // each embedding corresponds to the same chunk index
    chunkIndex: i
}));

    // }


    
    // now to save this in the database
    // console.log(chunkWithEmbeddings)
 await Chunk.insertMany(chunkWithEmbeddings);
    document.chunkCount = chunks.length;
    document.processingStatus = "completed";
    await document.save();
    console.log(`✅ Document processing completed!`);

 return {
        success: true,
        documentId: documentId,
        chunksCreated: chunks.length
      };
    } catch (error) {
        console.log(error)
        try {
           const document = await Document.findById(documentId);
           document.processingStatus ="failed"
           await document.save();
              
        } catch (error) {
             console.error('Failed to update document status:',error);
        }
        // throw error
    }
 

}

// to give user the feedback that our document is currentlr being processed
export const processDocumentAsync=(documentId)=>{
try {
    processDocument(documentId).catch(error=>{
        console.log(error);
        

        return { message:"document processing started"}

    })
} catch (error) {
    console.log(error)
}
}



export const getProcessingStatus = async(documentId)=>{
try {
    const document = await Document.findById(documentId).select("processingStatus");
    return {
        processingStatus:document.processingStatus
    }
} catch (error) {
    console.log(error)
}
}

