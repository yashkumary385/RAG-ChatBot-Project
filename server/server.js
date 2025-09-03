import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';
import upload from "./middleware/upload.js";
import { extractText, validateExtractedText } from "./middleware/textExtractor.js";
// import Document from "./models/Document.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(import.meta.url);
// // file:///C:/Users/ASUS/project/server.js

// console.log(fileURLToPath(import.meta.url));
// // C:\Users\ASUS\project\server.js


import ConnectDb  from "./config/db.js";
const app = express();
dotenv.config();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('uploads', express.static(path.join(__dirname, 'uploads')))

// health check Route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RAG API Server is running',
    timestamp: new Date().toISOString()
  });
});




app.get("/",(req,res)=>{
    res.send("hello we working !!! yes sirrr")
})


app.post("upload",upload.single("pdf"), async(req,res)=>{
  try {
    if(!req.file){
      return res.status(400).json(
        {
          success:false,
          error:"No file Uploaded"

        }
      )
    }

  const extraction=  await extractText(req.file.path , req.file.mimetype)
 validateExtractedText(extraction.content);

 const document = await Do





  } catch (error) {
    
  }
} )

ConnectDb()

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
    
})