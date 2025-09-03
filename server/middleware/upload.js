import multer from 'multer';
import path from "path";
  
// destination to store
const storage = multer.diskStorage({
    destination:function(req,cb,file){
        cb(null, 'uploads')
    },
    filename:function(req,file,cb){
        const ext =path.extname(file.originalname)
         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + ext)
    }
})

// filter which file we want
const fileFilter =async(req,file,cb)=>{
    const allowedTypes= [
 'text/plain',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
   if(allowedTypes.includes(file.mimeType)){
    cb(null , true)
   }else{
        cb(new Error(`File type ${file.mimetype} not supported. Please upload TXT, PDF, or DOC files.`), false);

   }
    
}
// configuring multer 
const upload= multer({
stoarge:storage,
fileFilter:fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  }

})
 export default upload