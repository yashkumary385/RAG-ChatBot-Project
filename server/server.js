import express from "express"
import dotenv from "dotenv";
import cors from "cors"
import path from "path"
import { fileURLToPath } from 'url';
import documentRoutes from "./routes/documentRoutes.js"
import queryRoutes from "./routes/questionRoutes.js"

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

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



app.use("/api/documents",documentRoutes)
// app.get("/",(req,res)=>{
//     res.send("hello we working !!! yes sirrr")
// })

app.use("/api/query",queryRoutes)


ConnectDb()

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
    
})