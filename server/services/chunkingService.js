// fixed-size chunking
export const fixedSizeChunking = (text, chunksize=200, overlap=50)=>{

const words = text.split(/\s+/); // converting into an array splitting at white spaces 
const chunks =[]; // to store an object of these arrays Example: "Hello world!" → ["Hello", "world!"]
for(let i=0 ; i< words.length; i+= chunksize - overlap ){
    const chunk = words.splice(i,i+chunksize).join(" "); // .join(' ') → converts the array of words back into a single string.
    if(chunk.trim()){
    chunks.push(
        {
            text : chunk.trim(),
            length:chunk.split(/\s+/).length, // again use regex to remove all the whitespaces 
            startindex:i
        }
    )
}
}
return chunks; // chunks of the whole document 

}