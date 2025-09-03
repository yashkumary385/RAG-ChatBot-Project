import fs from "fs"
// import pdf from "pdf-parse"
import pdf from "pdf-parse";
//pdf paresr not working 
export async function extractText(filePath, mimeType){
    switch(mimeType){
        case "text/plain" :
        return extractFromTxt(filePath)

        case "application/pdf" :
            return extractFromPdf(filePath)

         default:
      throw new Error(`Unsupported file type: ${mimeType}`);    
    }
       
 }

 function extractFromTxt (filePath){
    const content =  fs.readFileSync(filePath , "utf8").trim()
      const cleaned = content
      .replace(/\r\n/g, '\n')  // Normalize line endings
      .replace(/\n{3,}/g, '\n\n')  // Remove excessive line breaks
      .trim();
    
    return {
      content: cleaned,
      metadata: {
        wordCount: countWords(cleaned),
        characterCount: cleaned.length,
        lineCount: cleaned.split('\n').length
      }
 }
}

function countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }


export async function extractFromPdf(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);   // read PDF
    const data = await pdf(buffer);             // parse PDF
    
    const content = data.text || "";            // get text safely

    const cleaned = content
      .replace(/\r\n/g, "\n")       // normalize line endings
      .replace(/\n{3,}/g, "\n\n")   // remove excessive line breaks
      .trim();

    return {
      content: cleaned,
      metadata: {
        wordCount: countWords(cleaned),
        characterCount: cleaned.length,
        lineCount: cleaned.split("\n").length,
      },
    };
  } catch (err) {
    console.error("Error extracting PDF:", err.message);
    throw err;
  }
}


 export  function validateExtractedText(text) {
    if (!text || text.trim().length < 10) {
      throw new Error('Extracted text is too short or empty');
    }
    
    if (text.length > 1000000) { // 1MB text limit
      throw new Error('Extracted text is too large (>1MB)');
    }
    
    return true;
  }


   
