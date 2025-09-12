import multer from 'multer';
import path from "path";
  
// destination to store
console.log('multer hitt');

import fs from "fs";
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination:function(req,file,cb){

        cb(null, 'uploads')
        
    },
    filename:function(req,file,cb){
        const ext =path.extname(file.originalname)
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + ext)
    }
})

// filter which file we want
// function pdfFileFilter(req, file, cb) {




//   if (file.mimetype === "application/pdf" || "text/plain") {
//     cb(null, true);
//   } else {
//     cb(new Error("Only PDF files are allowed!"), false);
//   }
// }
// configuring multer 
const upload= multer({
storage:storage,
// fileFilter:pdfFileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  }

})
 export default upload