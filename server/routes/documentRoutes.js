import express, { Router } from "express";
import Document from "../models/Document.js";
import path from "path"
import fs from "fs"
import { extractTextFromFile,validateExtractedText } from "../middleware/textExtractor.js";

import upload from "../middleware/upload.js";
import { processDocumentAsync } from "../services/documentProcessingService.js";
const router = express.Router();

// list of all the documents 

router.get("/",async(req,res)=>{
  try {
      const documents = await Document.find({}).select("-content").sort({createdAt : -1});
     res.json({
      success: true,
      count: documents.length,
      data: documents
    });
  } catch (error) {
      console.error('Error fetching documents:', error);
    res.status(500).json({
      success: false,
      error: error
    });
  }
})


// upload documents 

router.post("/upload",upload.single("pdf"), async(req,res)=>{
  console.log("file received", req.file);

  try {
    if(!req.file){
      return res.status(400).json(
        {
          success:false,
          error:"No file Uploaded"

        }
      )
    }
    // console.log(req.file.path," this the file")
  const extraction=  await extractTextFromFile(req.file.path , req.file.mimetype)
//  validateExtractedText(extraction.content);
//  console.log(extraction)

 const document = await Document.create({
  title:req.body.title || path.parse(req.file.originalname).name,
  originalName:req.file.originalname,
content: String(extraction.content || ""),
  fileSize:req.file.size,
  mimeType:req.file.mimetype,
  uploadPath:req.file.path,
  processingState:"pending",
// chunkCount: chunking not done at this point
   metadata:extraction.metadata



 })


// console.log({
//   title: req.body.title,
//   originalName: req.file.originalname,
//   content: typeof extraction.content,
//   fileSize: req.file.size,
//   mimeType: req.file.mimetype,
//   uploadPath: req.file.path,
//   metadata: extraction.metadata
// });

 fs.unlinkSync(req.file.path);

    console.log('✅ Document saved:', document._id);



    processDocumentAsync(document._id);
    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        id: document._id,
        title: document.title,
        originalName: document.originalName,
        fileSize: document.fileSize,
        wordCount: document.metadata.wordCount,
        processingStatus: document.processingStatus,
        createdAt: document.createdAt
      }
    });


  } catch (error) {
     console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      error: error.message || 'File upload failed'
    });
  }
  
} )

// get a doc by id 
router.get("/:id",async(req,res)=>{
  try {
   
      const {doc_id} = req.params.id;
      console.log(doc_id);
      
  const document= await Document.findById(doc_id);
  if(!document){
      return res.status(404).json({
        success: false,
        error: error
      });
  }
    res.json({
      success: true,  
      data: document
    });
  } catch (error) {
      console.error('Error fetching document:', error);
    res.status(500).json({
      success: false,
      error: error
    });
  }

})


// delete a docuemnt
// route was not able to hit even when adress was correct look into this and correct  
router.delete("/delete/:id", async (req, res) => {
  console.log("hottt")
  try {
    console.log(req.params.id)
    const document = await Document.findById(req.params.id);
    
    if (!document) {
      return res.status(404).json({
        success: false,
        error: 'Document not found'
      });
    }

    // TODO: Also delete associated chunks (we'll add this later)
    await Document.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete document'
    });
  }
});


export default router



















